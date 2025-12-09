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
    perfee: 50,
    participants: 6,
    minparticipants: 2,
    maxParticipants: 10,
    rules: [
      "Team Size: 6 –10 models.",
      "Reporting Time: 9:00 AM – 9:30 AM (18/12/2025).",
      "Only one team per unit is allowed to register.",
      "Teams must present a coordinated theme through their outfits and choreography.",
      "Be creative, stylish, and work together effectively as a team.",
      "Performance Duration: Maximum of 5 minutes.",
      "Maintain synchronization, proper spacing, and confident posing throughout the performance.",
      "Props are allowed, provided they are safe and easy to handle.",
      "Follow all stage directions carefully and ensure smooth transitions.",
      "Be ready on time and prepared when called to the stage.",
      "The judges’ decision will be final and binding."
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
    perfee: 50,
    minparticipants: 2,
    participants: 6,
    maxParticipants: 10,
    rules: [
      "Each team must have 6 to 10 members.",
      "Reporting time: 9:00 AM – 9:30 AM (18/12/2025).",
      "Only one team per unit is allowed to register.",
      "Teams must perform a coordinated dance routine that showcases teamwork and creativity.",
      "Any dance style may be chosen, but the routine should align with the cinematic dance theme.",
      "Performance time limit: 4 to 6 minutes. (Additional time will be provided for prop setup and stage clearance.)",
      "Costumes must be coordinated and appropriate for the chosen theme.",
      "Props may be used, provided they are safe and easy to handle.",
      "Prohibited items (Safety Clause): Fire items, explosives, sharp/edged objects, water, powder, oil, or any materials that may damage or soil the stage.",
      "Teams must be ready on time and show respect for the stage and other participants.",
      "The judges’ decision will be final and binding."
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
    perfee: 50,
    participants: 1,
    minparticipants: 1,
    maxParticipants: 1,
    rules: [
      "Individual participation only.",
      "The registration fee per participant is ₹50.",
      "All registered participants will be included in the competition.",
      "A maximum of 2 volunteers per unit is allowed to register.",
      "Day 1 (17/12/2025) will consist of two rounds; those who qualify will proceed to the next day’s stages.",
      "Participants must report on time for every round; late entry may result in disqualification.",
      "All participants must follow the instructions given by the coordinators and judges without argument.",
      "The judges’ decisions will be final and cannot be challenged.",
      "The organizers reserve the right to modify the round format if necessary."
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
    perfee: 50,
    participants: 2,
    minparticipants: 2,
    maxParticipants: 4,
    rules: [
      "Team size: 2–4 members",
      "Reporting time: 9:00 AM – 9:30 AM (18/12/2025)",
      "Only one team per unit is allowed to register.",
      "The game will begin sharp at 9:30 AM.",
      "Participation is on a first-come, first-served basis due to limited seats.",
      "The event will consist of elimination rounds.",
      "Teams must report on time; late entry will not be allowed.",
      "Teams will be disqualified for:",
      "Damaging college property",
      "Intergroup discussions",
      "Entering restricted areas",
      "Entering off-limit zones (Library, Prayer Hall, Staff Rooms, Offices, AVT Room, Seminar Hall, all Labs)",
      "Tampering with or destroying QR codes",
      "If you move any objects while searching for clues, place them back properly.",
      "For any doubts, contact an available volunteer."
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
    perfee: 50,
    participants: 1,
    minparticipants: 1,
    maxParticipants: 1,
    rules: [
      "individual participations only",
      " reporting time : 9:00 - 9:30 (18/12/25)",
      " maximum 2 volunteers per unit is only allowed ",
      " The event will be conducted under a theme/topic announced on the day.",
      " ⁠Judges’ decision will be final and binding.",
      "⁠ send their best two photos along with their chest number in their google form",
      " ⁠photos must be captured strictly within the campus premises during contest time.",
      " Participants may use any device (phone, camera, tablet, etc.).",
      " No third-party edits, AI modifications, presets, or external editing apps (Lightroom, Snapseed, AI tools, etc.) are allowed.",
      " Plagiarism or copying others' work will lead to disqualification.",
      " ⁠do not disturb ongoing classes or academic activities.",
      " No damage should be caused to any college property.",
      " ⁠ pre-taken photos are not allowed.",
      " ⁠ Additional rules or last-minute updates may be announced during participation."
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
    perfee: 50,
    participants: 1,
    minparticipants: 1,
    maxParticipants: 1,
    rules: [
      "Individual participation only.",
      "Reporting time: 9:00 AM – 9:30 AM (18/12/2025).",
      "A maximum of 2 volunteers per unit may register.",
      "Theme: The reel must follow the assigned NSS theme.",
      "Video duration: 30–90 seconds.",
      "Originality: Only original content is allowed; no copied clips.",
      "Safety: No risky, offensive, political, or unethical content is permitted.",
      "Judging criteria: Creativity, theme relevance, clarity, editing, and overall impact.",
      "Disqualification grounds: Late submissions, copied content, unethical content, or AI-generated reels (if prohibited).",
      "Rights: NSS may use the submitted reels for campaigns and promotional purposes.",
      "Submit your reel before the deadline to be considered."
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
    minparticipants: 1,
    maxParticipants: 1,
    rules: [
      "Each team must consist of two members: one painter and one model(both must be NSS volunteers).",
      "Reporting time: 9:00 AM – 9:30 AM (18/12/2025).",
      "All participants must follow the announced theme.",
      "Materials will not be provided; participants must bring their own supplies.",
      "Only skin-safe, non-toxic paints are allowed.",
      "(Permanent markers, spray paint, and chemical-based products are strictly prohibited.)",
      "Painting should be limited to the face and neck area only.",
      "Extra fittings or accessories, other than face - painting materials, are not allowed.",
      "Only registered participants are allowed inside the competition area.",
      "There will be only one round.",
      "The judges’ decision will be final."
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
