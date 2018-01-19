import { EventService } from './event.service';
import { EventDeactivateGuard } from './event-deactivate.guard';

export const EVENT_PROVIDERS: any[] = [EventService, EventDeactivateGuard];
