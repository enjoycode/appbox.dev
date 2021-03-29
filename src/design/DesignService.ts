
/** 包装设计时Api */
export default class DesignService {

    public static GetAppSettings(appName: string | null, settingName: string): Promise<any> {
        return $runtime.channel.invoke('sys.DesignService.GetAppSettings', [appName, settingName]);
    }

    public static SaveAppSettings(appName: string | null,
                                  settingName: string, settingType: string, settingValue: any): Promise<void> {
        return $runtime.channel.invoke('sys.DesignService.SaveAppSettings',
            [appName, settingName, settingType, settingValue]);
    }

}
