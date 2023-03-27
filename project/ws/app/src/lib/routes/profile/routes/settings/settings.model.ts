export namespace NsSettings {
  export interface INotificationGroup {
    group_id: string
    group_name: string
    events: INotificationEvent[]
    // below for UI. Actually it doesn't exist. using jugaad  talent
    show: boolean
  }

  export interface INotificationEvent {
    event_id: string
    recipients: INotificationRecipient[]
    event_name: string
  }

  export interface INotificationRecipient {
    modes: INotificationMode[]
    recipient: string
  }

  export interface INotificationMode {
    mode_id: string
    mode_name: string
    status: boolean
  }

  export interface INotificationPreferenceResponse {
    defaultNotificationDuration: INotificationDuration,
    notificationPreferenceList: INotificationPreference[]
  }

  export interface INotificationPreference {
    displayName: string
    helpText: string
    id: string
    isVisible: boolean
    labelText: string
    notificationDuration: INotificationDuration
    status?: boolean
  }

  export interface INotificationDuration {
    day: string
    occurance: string
    time: string
  }
}
