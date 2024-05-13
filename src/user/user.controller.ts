import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "./user.schema";
import { UsersService } from "./user.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "src/dto/login.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.userService.createUser({
      email: createUserDto.email,
      password: hashedPassword,
    });
  }
  @Post("/login")
  async loginUser(@Body() loginDto: LoginDto) {
    return this.userService.loginUser(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUser(@Param("id") userId: string) {
    return this.userService.getUserById(userId);
  }
}
