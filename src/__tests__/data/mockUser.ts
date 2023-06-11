import { Types } from "mongoose"

const mockUser = {
  firstName: 'Jaydon',
  lastName: 'Abbott',
  email: 'Elena.Olson@hotmail.com',
  password: '$2b$10$I8vXdJdsyeSO3zP6vsO6yeUoYa6x0Mwls2UYHaxPj/yt7orcTECmi',
  pictureUrl50px: 'assets/pictures/default.svg',
  pictureUrl100px: 'assets/pictures/default.svg',
  pictureUrl400px: 'assets/pictures/default.svg',
  profilePath: 'user-JWt1mk5ru',
  friends: [],
  friendRequestsReceived: [],
  friendRequestsSent: [],
  birthday: null,
  city: null,
  occupation: null,
  status: null,
  canAnyonePost: true,
  _id: new Types.ObjectId("644012a529536e78362cddf0"),
  createdAt: "2023-04-19T16:11:17.722Z",
  updatedAt: "2023-04-19T16:11:17.722Z",
  __v: 0
}

export default mockUser;
