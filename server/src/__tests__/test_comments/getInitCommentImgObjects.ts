interface IImgObj {
  previewSize: string,
  fullSize: string,
  _id: string
}


export default function getInitCommentImgObjects(amount: number) {
  const data = [
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/NvCTb0eZNgQpTxlGW6pL-1684595774032.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/Ox7HiTvzxTUZbD7ArkPp-1684595774051.webp",
        "_id": "6468e442d64bb77a85ba9a53"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/1jUWG-tXBsdl800A8Ibf-1684595774035.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/qhA6kLJgo19oe1Q9Yu8J-1684595774053.webp",
        "_id": "6468e442d64bb77a85ba9a54"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/2N_Q7QiTKegducmgb9tx-1684595774036.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/CM5o6SxuWNCWHfq6JpJ2-1684595774054.webp",
        "_id": "6468e442d64bb77a85ba9a55"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/8ZTOQxhm1mp8BEePhpeF-1684595774039.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/uSbUFDzPqlpUSjjMY6p5-1684595774055.webp",
        "_id": "6468e442d64bb77a85ba9a56"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/zpVJAQUp8DT2WJyPZGXv-1684595774043.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/KBQEGCxkONvxgtG3KNL9-1684595774055.webp",
        "_id": "6468e442d64bb77a85ba9a57"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/FurAsEnUB_nPphaRfeVe-1684595774044.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/GUDyifcM6fV0ZLm7YWUu-1684595774056.webp",
        "_id": "6468e442d64bb77a85ba9a58"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/yVA5cVvWRH0pgwnx8dtP-1684595774046.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/guY_YHVXZxt8cPZbHeDB-1684595774057.webp",
        "_id": "6468e442d64bb77a85ba9a59"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/IpajiQITRvRMNtW9buw7-1684595774047.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/wX15gPB1e_s8TVpnXWJj-1684595774059.webp",
        "_id": "6468e442d64bb77a85ba9a5a"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/-uSbEo1-RNGCoNqmYsDQ-1684595774049.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/0B4rR0-mnaKhe0lm6H4k-1684595774060.webp",
        "_id": "6468e442d64bb77a85ba9a5b"
    },
    {
        "previewSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/DbVsWAh1Be_YqjZDK9gU-1684595774050.webp",
        "fullSize": "https://s3.timeweb.com/3fc3a54c-e6e5e4d7-4608-419b-8acd-904bd53b1f22/C-6NGxlOZuV-JuCneFZ1-1684595774060.webp",
        "_id": "6468e442d64bb77a85ba9a5c"
    }
  ];

  if (amount > 10) throw new RangeError("amount must be below 10");


  const result: IImgObj[] = [];
  for (let i = 0; i < amount; i++) {
    result.push(data[i]);
  }

  return result;
}
