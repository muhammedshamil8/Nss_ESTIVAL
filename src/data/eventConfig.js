//payment qr codes
import { Group_dance_QR, Best_volunteer_QR, Fashion_show_QR, Spot_photography_QR }
  from "@/assets/paymentqrcodes";

export const EVENTS = {
  "fashion-show": {
    title: "Fashion Show",
    fee: 500,
    participants: 1,
    rules: [
      "Theme will be given 1 hour before.",
      "Participants must bring their own costume.",
      "No vulgarity allowed."
    ],
    paymentDetails: {
      Gpay: "9995596035",
      upi_id: "rishanmachingal@okicici",
      qrcode: Fashion_show_QR
    },
    coordinators: [
      { name: "Rishan  M", phone: "9995596035" },
      { name: "Thanha Jannath", phone: "8891176407" }
    ]
  },

  "group-dance": {
    title: "Group Dance",
    fee: 300,
    participants: 6,
    rules: [
      "Minimum 4, Maximum 8 participants.",
      "Song duration: 3 minutes max.",
      "Props allowed but must be brought by team."
    ],
    paymentDetails: {
      Gpay: "8589062471",
      upi_id: "vahidabdulvahidp54@oksbi",
      qrcode: Group_dance_QR
    },
    coordinators: [
      { name: "Abdul Vahid p", phone: "8589062471" },
      { name: "Rifa Rizvin", phone: "9061174579" }
    ]
  },

  "best-volunteer": {
    title: "Best Volunteer",
    fee: 100,
    participants: 1,
    rules: [
      "Individual event.",
      "Participants must bring their NSS ID.",
      "Judging based on leadership & discipline."
    ],
    paymentDetails: {
      Gpay: "9567154523",
      upi_id: "muhammedhisham4523@oksbi",
      qrcode: Best_volunteer_QR
    },
    coordinators: [
      { name: "Hisham E", phone: "9567154523" },
      { name: "Deena mk", phone: "8138073099" }
    ]
  },

  "treasure-hunt": {
    title: "Treasure Hunt",
    fee: 200,
    participants: 4,
    rules: [
      "Team of 4 members.",
      "No phones allowed.",
      "Judgment based on time & completion."
    ],
    paymentDetails: {
      Gpay: "",
      upi_id: "",
      qrcode: ""
    },
    coordinators: [
      { name: "", phone: "" },
      { name: "", phone: "" }
    ]
  },

  "spot-photography": {
    title: "Spot Photography",
    fee: 50,
    participants: 1,
    rules: [
      "Participants must bring their own camera/phone.",
      "Editing allowed within 15 minutes."
    ],
    paymentDetails: {
      Gpay: "8075236008",
      upi_id: "ziyadzidu9526@okaxis",
      qrcode: Spot_photography_QR
    },
    coordinators: [
      { name: "Ziyad ", phone: "80752 36008" },
      { name: "Sanha ", phone: "92073 41002" }
    ]
  },

  "spot-reel-making": {
    title: "Spot Reel Making",
    fee: 50,
    participants: 1,
    rules: [
      "Duration: 20–30 seconds.",
      "Only mobile phone allowed.",
      "Theme will be given on spot."
    ],
    paymentDetails: {
      Gpay: "",
      upi_id: "",
      qrcode: ""
    },
    coordinators: [
      { name: "", phone: "" },
      { name: "", phone: "" }
    ]
  },

  "face-painting": {
    title: "Face Painting",
    fee: 50,
    participants: 1,
    rules: [
      "Theme will be announced on spot.",
      "Bring your own materials."
    ],
    paymentDetails: {
      Gpay: "",
      upi_id: "",
      qrcode: ""
    },
    coordinators: [
      { name: "", phone: "" },
      { name: "", phone: "" }
    ]
  }
};
