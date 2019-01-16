import { Injectable } from '@angular/core';
import { NzMessageService, NzMessageDataOptions, NzMessageDataFilled } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private nzMessageService: NzMessageService
  ) { }

  success(content: string, options?: MessageDataOptions): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.success(content, options);
  }

  error(content: string, options?: MessageDataOptions): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.error(content, options);
  }

  info(content: string, options?: MessageDataOptions): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.info(content, options);
  }

  warning(content: string, options?: MessageDataOptions): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.warning(content, options);
  }

  loading(content: string, options?: MessageDataOptions): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.loading(content, options);
  }

  create(
    type: 'success' | 'info' | 'warning' | 'error' | 'loading' | string,
    content: string,
    options?: MessageDataOptions
    ): MessageDataFilled {
    return <MessageDataFilled>this.nzMessageService.create(type, content, options);
  }
}

export interface MessageDataOptions extends NzMessageDataFilled {
  nzDuration?: number;
  nzAnimate?: boolean;
  nzPauseOnHover?: boolean;
}

export interface MessageData extends NzMessageDataFilled {
  type?: 'success' | 'info' | 'warning' | 'error' | 'loading' | string;
  content?: string;
}

export interface MessageDataFilled extends NzMessageDataFilled {
  messageId: string;
  state?: 'enter' | 'leave';
  options?: MessageDataOptions;
  createdAt: Date;
}

