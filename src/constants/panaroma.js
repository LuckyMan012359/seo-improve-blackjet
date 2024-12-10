export const panaromaScenes = (func) => {
  return {
    lavatory: {
      // "title": "lavatory",
      type: "equirectangular",
      panorama: "/images/Pano Lav.jpg",
      hotSpots: [
        {
          pitch: 10,
          yaw: 90,
          type: "scene",
          text: "Front",
        //   sceneId: "front",
        //   targetYaw: 0,
          clickHandlerFunc: (e) => func(1),
        },
      ],
    },
    front: {
      // "title": "Front",
      type: "equirectangular",
      yaw: 180,
      panorama: "/images/Pano Front.jpg",
      hotSpots: [
        {
          pitch: -45,
          yaw: -2,
          type: "scene",
          text: "Middle",
        //   sceneId: "middle",
        //   targetYaw: 180,
          clickHandlerFunc: (e) => func(2),
        },
        // {
        //     "pitch": -9,
        //     "yaw": 0,
        //     "type": "scene",
        //     "text": "Rear",
            // "sceneId": "rear",
        // },
        {
          pitch: -37,
          yaw: -132,
          type: "scene",
          text: "Lavatory",
        //   sceneId: "lavatory",
          clickHandlerFunc: (e) => func(0),
        },
      ],
    },
    middle: {
      // "title": "Middle",
      type: "equirectangular",
      panorama: "/images/Pano Middle.jpg",
      hotSpots: [
        {
          pitch: -30,
          yaw: 2,
          type: "scene",
          text: "Front",
        //   sceneId: "front",
          clickHandlerFunc: (e) => func(1),
        },
        {
          pitch: -30,
          yaw: 178,
          type: "scene",
          text: "Rear",
        //   sceneId: "rear",
          clickHandlerFunc: (e) => func(4),
        },
      ],
    },
    "middle-rear": {
      // "title": "Middle Rear",
      type: "equirectangular",
      panorama: "/images/Pano Middle Rear.jpg",
      hotSpots: [
        {
          pitch: -33,
          yaw: -120,
          type: "scene",
          text: "Front",
        //   sceneId: "front",
          clickHandlerFunc: (e) => func(1),
        },
        {
          pitch: -18,
          yaw: 34,
          type: "scene",
          text: "Rear",
        //   sceneId: "rear",
          clickHandlerFunc: (e) => func(4),
        },
      ],
    },
    rear: {
      // "title": "Rear",
      type: "equirectangular",
      yaw: 180,
      panorama: "/images/Pano Rear.jpg",
      hotSpots: [
        {
          pitch: -54,
          yaw: -3,
          type: "scene",
          text: "Middle",
        //   sceneId: "middle",
          clickHandlerFunc: (e) => func(2),
        },
        // {
        //     "pitch": -16,
        //     "yaw": -1,
        //     "type": "scene",
        //     "text": "Front",
        //     "sceneId": "front",
        // }
      ],
    },
  };
};
