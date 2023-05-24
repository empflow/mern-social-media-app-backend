import userProjection from "./userProjection";

const friendReqUserProjection = {
  ...userProjection,
  friends: 1 ,
  friendRequestsSent: 1,
  friendRequestsReceived: 1
}

export default friendReqUserProjection;
