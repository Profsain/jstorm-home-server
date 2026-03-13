import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<Setting>) {}

  async getSettings(): Promise<Setting> {
    let settings = await this.settingModel.findOne({ type: 'settings' }).exec();
    if (!settings) {
      settings = new this.settingModel({
        type: 'settings',
        whatsappNumber: '+2340000000000',
      });
      await settings.save();
    }
    return settings;
  }

  async updateSettings(updateSettingDto: UpdateSettingDto): Promise<Setting> {
    let settings = await this.settingModel.findOne({ type: 'settings' }).exec();
    if (!settings) {
      settings = new this.settingModel({
        type: 'settings',
        ...updateSettingDto,
      });
    } else {
      settings.whatsappNumber = updateSettingDto.whatsappNumber;
    }
    return settings.save();
  }
}
