import { Body, Controller,  Get, Param, Post,Put, Query,Delete,Patch, ClassSerializerInterceptor, UseInterceptors, NotFoundException } from '@nestjs/common';
import { Session } from '@nestjs/common';
//import { AuthGuard } from 'src/guards/auth.guard';
//import { serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
//import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
//@serialize(UserDto)
//@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(private userService:UsersService,private authService:AuthService){}
    
    @Get('/colors/:color')
    setColor(@Param('color') color:string,@Session() Session:any){
        Session.color=color;
    }

    @Get('/colors')
    getColor(@Session() session:any){
        return session.color;
    }
    
    @Post('/signup')
    async createUser(@Body() body:CreateUserDto,@Session() session:any){
      const user= await this.authService.signup(body.email,body.password);
        session.userId=user.id
        return user;
    }

    @Post('/signout')
    signOut(@Session() session :any){
        return session.userId=null;
    }

    // @Get('/whoAmI')
    // async WhoAmI(@Session() session:any){
    //     return await this.userService.findOne(session.userId);
    // }

    @Get('/whoAmI')
   // @UseGuards(AuthGuard)
    async WhoAmI(@CurrentUser() user:User){
        return user
    }

    @Post('/signin')
    async signin(@Body() Body:CreateUserDto,@Session() session:any){
        const user=await this.authService.signin(Body.email,Body.password);
        session.userId=user.id
        return user;
    }

   
    @Get('/:id')
    async findUser(@Param('id') id:string){
        const user=await this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException('user not found')
        }
       return user;
    }

    
    @Get()
    findAllUsers(@Query('email') email:string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id:string){
        return this.userService.remove(parseInt(id));
    }

    @Put('/:id')
    updateUser(@Param('id') id:string, @Body() body:UpdateUserDto){
        return this.userService.update(parseInt(id),body)
    }
}
