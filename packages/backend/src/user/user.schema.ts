import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsEmail, IsIn, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { DbObject } from '../common';

export type UserDocument = User & Document;

export const knownUserRoles = ['user', 'admin'] as const;
export type UserRoles = typeof knownUserRoles[number];

@Schema()
export class User extends DbObject {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  @IsEmail()
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: ['user'] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsIn(knownUserRoles)
  roles: Array<UserRoles>;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserRead = Omit<User, 'passwordHash'>;

export class UserCreate extends OmitType(User, ['passwordHash', 'roles']) {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
  password: string;
}
