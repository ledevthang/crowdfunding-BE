import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus, Res, UnauthorizedException, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Response } from 'express';
import { PagingDto } from 'src/base/base.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() createCampaignDto: CreateCampaignDto, @Res() res: Response) :Promise<Response> {
    try {
      if (createCampaignDto) {
        const user = req.user;
        const success = await this.campaignService.create(user, createCampaignDto);
        return res.status(HttpStatus.OK).json({success});
      } else {
        throw new Error('Error payload creating campaign')
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  @UseGuards(AuthGuard)
  @Get('self')
  async findForAdmin(@Request() req, @Query() pagingDto: PagingDto, @Res() res: Response) : Promise<Response>{
    try {
      const user = req.user;
      if (user.roleId === 1) {
        const campaignsPaging = await this.campaignService.findForAdmin(user.id, pagingDto);
        return res.status(HttpStatus.OK).json(campaignsPaging);
      } else {
        const campaignsPaging = await this.campaignService.findForUser(user.id, pagingDto);
        return res.status(HttpStatus.OK).json(campaignsPaging);
      }
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  @Get()
  async find(@Query() pagingDto: PagingDto, @Res() res: Response) : Promise<Response>{
    try {
      const campaignsPaging = await this.campaignService.find(pagingDto);
      return res.status(HttpStatus.OK).json(campaignsPaging);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json(error.response);
    }
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
  //   try {
  //     const campaign = await this.campaignService.findOne(+id);
  //     return res.status(HttpStatus.OK).json(campaign);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(HttpStatus.BAD_REQUEST).json(error.response);
  //   }
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(+id);
  }
}
