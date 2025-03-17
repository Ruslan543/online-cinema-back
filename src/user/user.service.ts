import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, UserModel } from "./user.model";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { Types } from "mongoose";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: UserModel,
  ) {}

  async getById(_id: string) {
    const user = await this.UserModel.findById(_id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.getById(_id);
    const sameUser = await this.UserModel.findOne({ email: dto.email });

    if (sameUser && String(_id) !== String(sameUser._id)) {
      throw new NotFoundException("Email busy");
    }

    if (dto.password) {
      const password = await this.UserModel.hashingPassword(dto.password);
      user.password = password;
    }

    user.email = dto.email;

    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin;
    }

    await user.save();
    return;
  }

  async getCount() {
    return this.UserModel.find().countDocuments().exec();
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [{ email: new RegExp(searchTerm, "i") }],
      };
    }

    const users = await this.UserModel.find(options)
      .select("-password -updatedAt -__v")
      .sort({ createdAt: "desc" });

    return users;
  }

  async delete(id: string) {
    const user = await this.UserModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async toggleFavorite(movieId: Types.ObjectId, user: UserDocument) {
    const { _id, favorites } = user;

    const newFavorites = favorites.includes(movieId)
      ? favorites.filter((id) => String(movieId) !== String(id))
      : [...favorites, movieId];

    const updatedUser = await this.UserModel.findByIdAndUpdate(
      _id,
      { favorites: newFavorites },
      { new: true, runValidators: true },
    );

    return updatedUser;
  }

  async getFavoriteMovies(_id: Types.ObjectId) {
    const user = await this.UserModel.findById(_id, "favorites")
      .populate({
        path: "favorites",
        populate: "genres",
      })
      .exec();

    return user?.favorites;
  }
}
