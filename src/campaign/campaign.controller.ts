import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus, Res } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
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
      const userId = req.user.id;
      const susscess = await this.campaignService.create(userId, createCampaignDto);
      return res.status(HttpStatus.OK).json({susscess});
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Get()
  async find(@Param() pagingDto: PagingDto, @Res() res: Response) : Promise<Response>{
    try {
      const campaignsPaging = await this.campaignService.find(pagingDto);
      return res.status(HttpStatus.OK).json(campaignsPaging);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(+id);
  }
}
