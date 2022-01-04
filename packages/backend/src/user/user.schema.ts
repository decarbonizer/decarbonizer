import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Document } from 'mongoose';
import { DbObjectSchema } from '../common/db/db-object-schema.decorator';
import { DbObject } from '../common/db/db-object.schema';

export type UserDocument = User & Document;

export enum UserRoles {
  User = 'user',
}

@DbObjectSchema({ timestamps: true })
export class User extends DbObject {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @ApiProperty()
  @IsEmail()
  companyId: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: [UserRoles.User] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsEnum(UserRoles)
  roles: Array<UserRoles>;
}

export const UserSchema = SchemaFactory.createForClass(User);

/**
 * A user object with sensitive attributes stripped away.
 */
export class SafeUser extends OmitType(User, ['passwordHash']) {}

export class UserCreate extends OmitType(User, ['createdAt', 'updatedAt', 'passwordHash', 'roles']) {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
  password: string;
}
