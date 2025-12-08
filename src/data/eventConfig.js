//payment qr codes
import {
  Group_dance_QR, Best_volunteer_QR,
  Fashion_show_QR, Spot_photography_QR, Reel_Making_QR, Treasure_hunt_QR, Face_Painting_QR
}
  from "@/assets/paymentqrcodes";

export const EVENTS = {
  "fashion-show": {
    title: "Fashion Show",
    fee: 500,
    participants: 2,
    maxParticipants: 10,
    rules: [
      "Each team can have a maximum of 10 participants",
      "Present a coordinated theme through outfits and choreography.",
      "Be creative, stylish, and work together as a team.",
      "Performance duration should be 5 minutes.",
      "Stay in sync, maintain spacing, and hold poses confidently.",
      "Props are allowed, but they must be safe and easy to handle.",
      "Follow stage directions carefully and ensure smooth transitions.",
      "Be ready on time and prepared for the stage.",
      "The registration fee for each team is 500.",
      "The judges’ decision is final."
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
    participants: 7,
    maxParticipants: 10,
    rules: [
      "Each team should have 7 to 10 members.",
      "Perform a coordinated dance routine showing teamwork and creativity.",
      "There is no specific dance item — feel free to choose your style.",
      "Time limit for the performance is 4 to 6 minutes. (an adittional time will be  allotted for prop setup and stage clearance)",
      "Costumes should be coordinated and match your performance theme.",
      "Props can be used but must be safe and easy to handle.",
      "Be ready on time and respect the stage and other teams.",
      "The judges’ decision is final."
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
    maxParticipants: 1,
    rules: [
      "Individual event.",
      " Every participant must pay a registration fee of 100 to enter the contest.",
      "All registered participants will be included in the competition.",
      "Day 1 (17/12/2025) will consist of two rounds, and those who qualify will move on to the next day’s stages.",
      "Participants must report on time for every round; late entry may lead to disqualification.",
      "All participants are expected to follow the instructions given by the coordinators and judges without argument.",
      "The judges’ decisions will be final and cannot be challenged.",
      "The organizers reserve the right to make changes to the round format if required."
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
    participants: 2,
    maxParticipants: 4,
    rules: [
      "Each team must consist of 2 to 4 members.",
      "All teams must reach the venue before 10:00 AM (The venue details will be shared in the group).",
      "The game will begin sharp at 10:30 AM.",
      "Limited Seats - Participation is on a first-come, first-served basis due to limited slots.",
      "Teams will be disqualified if they engage in any of the following:",
      "Damaging college property. , Intergroup discussions. , Entering restricted areas. , Off-limit zones: Library, Prayer Hall, Staff Rooms, Offices, AVT Room, Seminar Hall, and all Labs. , Tampering with or destroying QR codes.",
      "The event will consist of elimination rounds to shortlist teams.",
      "Punctuality is crucial – teams must be present at the venue on time.",
      "If you move any objects while searching for clues, please return them to their original place.",
      "If you have any doubts, consult an available volunteer for assistance."
    ],
    paymentDetails: {
      Gpay: "8129689112",
      upi_id: "fadhil6601@okhdfcbank",
      qrcode: Treasure_hunt_QR
    },
    coordinators: [
      { name: "Swalih ", phone: "99464 30990" },
      { name: "Hilfa ", phone: "90722 62133" }
    ]
  },

  "spot-photography": {
    title: "Spot Photography",
    fee: 50,
    participants: 1,
    maxParticipants: 1,
    rules: [
      "The event will be conducted under a specific theme/topic announced on the day",
      "Participants must follow all instructions given by the coordinators.",
      "Additional rules or last-minute updates may be announced during participation.",
      "Judges’ decision will be final and binding.",
      "Contest time: 10:30 AM – 12:30 PM.",
      "Deadline for submission: 12:30 PM sharp. Late submissions will not be accepted.",
      "All photos must be submitted in document format (PDF/Doc) as instructed.",
      "Each participant must send their best two photos along with their chest number to the given phone number",
      "All photos must be captured strictly within the campus premises during contest time.",
      "Participants may use any device (phone, camera, tablet, etc.).",
      "No third-party edits, AI modifications, presets, or external editing apps (Lightroom, Snapseed, AI tools, etc.) are allowed.",
      "Plagiarism or copying others' work will lead to disqualification.",
      "Ensure safety while clicking photos; do not disturb ongoing classes or academic activities.",
      "No damage should be caused to any college property.",
      "Avoid entering restricted areas unless permitted by coordinators.",
      "Participants must maintain professional behaviour and respect campus regulations.",
      "Any kind of misconduct, argument, or rule violation can result in immediate disqualification.",
      "Photos must be originally captured during the contest duration; pre-taken photos are not allowed.",
      "Watermarks, signatures, borders, or text overlays are not permitted.",
      "Only natural lighting and in-camera settings may be used; no external lighting setup (studio lights, ring lights, etc.).",
      "Participants are responsible for ensuring the quality and clarity of their submitted photos.",
      "If technical issues occur during submission, participants must inform coordinators before the deadline.",
      "Grouping or collaboration between participants during shooting is not allowed."
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
    maxParticipants: 1,
    rules: [
      ".",
      "",
      ""
    ],
    paymentDetails: {
      Gpay: "8089346724",
      upi_id: "jiyadroashan@okaxis",
      qrcode: Reel_Making_QR
    },
    coordinators: [
      { name: "Althaaf ", phone: "90374 78186" },
      { name: "Jiyad roashan", phone: "80893 46724" }
    ]
  },

  "face-painting": {
    title: "Face Painting",
    fee: 50,
    participants: 1,
    maxParticipants: 1,
    rules: [
      "",
      ""
    ],
    paymentDetails: {
      Gpay: "8301977257",
      upi_id: "anshibaathimannil@okicici",
      qrcode: Face_Painting_QR
    },
    coordinators: [
      { name: "Anshiba ", phone: "8301977257" },
      { name: "Shahana ", phone: "8891173918" }
    ]
  }
};
