export interface City {
  id: string;
  province: string;
  city: string;
  country: string;
  pid: string;
  cityLevel: string;
}

export interface ScenicSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  opentime: string;
  ticket: string;
  introduction: string;
  img: string[];
  dqid: string;
  score: number;
  checkStatus: string;
  dqList: string;
  number: string;
  type: string;
}

export interface RedCulture {
  id: string;
  redImg: string[];
  tourId: string;
  tourName: string;
  lssj: string;
  sdbj: string;
  xgrw: string;
  jtqj: string;
  wwgj: string;
  checkStatus: string;
  title: string;
  historyPeriod?: string;
}

export interface Comment {
  id: string;
  tourId: string;
  content: string;
  likeNumber: number;
  userName: string;
  createTime: string;
}

export interface User {
  id: string;
  name: string;
  number: string;
  password?: string;
}

export interface ThemeRoute {
  id: string;
  routeName: string;
  routeTheme: string;
  scenicSpotIds: string[];
  totalDuration: string;
  routeIntro: string;
}