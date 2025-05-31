// Объявления типов для модулей без собственных деклараций типов
declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  
  export const Calendar: ComponentType<any>;
  export const momentLocalizer: (moment: any) => any;
  // Другие экспорты, если нужны
}

declare module 'moment/locale/ru' {
  const content: any;
  export default content;
}
