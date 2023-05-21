import { IPostImg } from "../../models/Post";

export default function getInitPostImgObjs(amount: number) {
  if (amount > 10) throw new RangeError("amount must be below 10");

  const data = [
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/l9zs_Q6Z6iICzVIVPJkf-1684658117928.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/zdZxFWRL64KfuL2Ojr2r-1684658117929.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/-z82pgGqQxUyneKDkfgu-1684658117930.webp",
        "_id": "6469d7c6a029222eaf4e51e8"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/1CTg3vSYHnRQzMPuD3zK-1684658117931.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/ENPoJu99aF-mlSeBHMtd-1684658117932.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/iWHED8_pYGkDyHFi6WrL-1684658117933.webp",
        "_id": "6469d7c6a029222eaf4e51e9"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/-LtB05rklQJpmEXJGY2d-1684658117933.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/rOwhT2UsD4yRXGRArUsP-1684658117934.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/Gp42cHAm5jV0wx-ORls5-1684658117935.webp",
        "_id": "6469d7c6a029222eaf4e51ea"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/cypIKyAE139xMRR7ebKl-1684658117936.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/OWqOyZEWzCuS77wXWVhc-1684658117937.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/rcAMVUtbAZutFgkD-eqG-1684658117938.webp",
        "_id": "6469d7c6a029222eaf4e51eb"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/z62oivMNNfFxjaGw3uFD-1684658117939.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/A8f79t-MfIHgQCf1XuyC-1684658117940.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/l4MLO9FXFTYiB7qS9muO-1684658117941.webp",
        "_id": "6469d7c6a029222eaf4e51ec"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/6WwHtc2HrRj6LJVxpzBu-1684658117941.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/y4_7NINMDJYYfR_wWgt0-1684658117942.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/SNrJPqnaBAYzvgQmnNVY-1684658117942.webp",
        "_id": "6469d7c6a029222eaf4e51ed"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/72Et8MlQswOaV3ruox4K-1684658117943.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/I1oXvFj_wi-s3LLGYcg6-1684658117944.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/sB75B-s9mSTV1lT76A5o-1684658117944.webp",
        "_id": "6469d7c6a029222eaf4e51ee"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/xm95rxcTlKYZjWVy8bkZ-1684658117945.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/vA2RnzXGg04qPTWv6_FR-1684658117945.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/ua0kySuxs_PMma0UgfVa-1684658117946.webp",
        "_id": "6469d7c6a029222eaf4e51ef"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/VJqUXhhNWDDJoMKKAYOf-1684658117946.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/tM5CCP3W48pVwGJN8TSB-1684658117947.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/N68AJcUqnTlAJcM7Cfk3-1684658117948.webp",
        "_id": "6469d7c6a029222eaf4e51f0"
    },
    {
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/G3ODdWfnBexXeKSUqg-v-1684658117948.webp",
        "feedSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/SKnTuk41AFIfEee--jPY-1684658117948.webp",
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/vmjHt3p-orA-BkUjZiZ--1684658117949.webp",
        "_id": "6469d7c6a029222eaf4e51f1"
    }
  ];

  const result = [];
  for (let i = 0; i < amount; i++) {
    result.push(data[i]);
  }

  return result;
}