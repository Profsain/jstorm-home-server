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
        whatsappNumber: '+44737915649',
        shortletWhatsapp: '+44737915649',
        propertiesWhatsapp: '+2348141880667',
      });
      await settings.save();
    } else {
      // Migrate or initialize if missing
      let needsSave = false;
      if (!settings.shortletWhatsapp) {
        settings.shortletWhatsapp = '+44737915649';
        needsSave = true;
      }
      if (!settings.propertiesWhatsapp) {
        settings.propertiesWhatsapp = '+2348141880667';
        needsSave = true;
      }
      if (needsSave) await settings.save();
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
      if (updateSettingDto.whatsappNumber) settings.whatsappNumber = updateSettingDto.whatsappNumber;
      settings.shortletWhatsapp = updateSettingDto.shortletWhatsapp;
      settings.propertiesWhatsapp = updateSettingDto.propertiesWhatsapp;
    }
    return settings.save();
  }
}
