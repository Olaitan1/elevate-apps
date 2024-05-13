import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import { ConflictException } from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';


@Injectable()
export class UsersService
{
 constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<User>
  {
    const { email, password } = createUserDto;

    // Check if a user with the same phone number already exists
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      // User with the same phone number already exists
      throw new ConflictException('User with the same phone number already exists');
    }

    const createdUser = new this.userModel({ email, password });

     const savedUser = await createdUser.save();
 
  return savedUser;
}
  async loginUser(loginDto: LoginDto)
  {
    const { email, password } = loginDto;

    // Find the user by phone number
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // User not found
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the login password with the bcrypt encrypted password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Invalid password
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate JWT token
    const token = jwt.sign({ email: user.email }, 'yourSecretKey');
    // Login successful
    return {
      message: 'Login successful',
      user: {
        email: user.email,
        id: user._id,
          token,
        createdAt: user.createdAt,
      },
    };
  }
  async findUserByemail(email: string): Promise<User>
  {
    return this.userModel.findOne({ email }).exec();
  }
  // Import the ObjectId type from mongoose

  async getUserById(userId: string): Promise<User>
  {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }


};