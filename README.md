# Mediation 3D Client

## Requirement

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [twilio account](https://www.twilio.com/)
- [Server project](https://github.com/Mediation3D/Server-Mediation)
- (_Optional_) [Server Emotion project](https://github.com/Mediation3D/Server-Mediation)
- **Assets :**
    - [3D meshes](https://drive.google.com/file/d/11tRgB2jkTudVkEfinZLu5oJEuISuOiTa/view?usp=sharing)
    - [skyboxes](https://drive.google.com/file/d/1QavK_zqkmd3jM5GQUtqqYVDicaPtz887/view?usp=sharing)
    - [textures](https://drive.google.com/file/d/123XlOZzN6eHn19jMJlJS-WlFlbnVlNUK/view?usp=sharing)

## Installation

1. clone Github repository : `git clone https://github.com/Mediation3D/Client-Mediation.git`
2. install npm dependency : `npm i` (if you use **yarn** : `yarn`)
3. copy & rename **.env.template** into **.env**, then complete with your twilio API data
4. Download unzip & move assets :
    - unzip meshes folder and move files into [public/assets/meshes](public/assets/meshes)
    - unzip skyboxes folder and move files into [public/assets/skyboxes](public/assets/skyboxes)
    - unzip textures folder and move files into [public/assets/textures](public/assets/textures)
5. start project (dev mode) : `npm run dev`

for more details look [Vue.js documentation](https://vuejs.org/guide/introduction.html)

## Architecture

![](./Architecture.jpg)

### Technologies

**Languages & Frameworks**
- [TypeScript](https://www.typescriptlang.org/)
- [Vue.js](https://vuejs.org/)
- [Python](https://www.python.org/)

**Libraries/packages**
- [Mediapipe](https://developers.google.com/mediapipe)
- [Babylon.js](https://www.babylonjs.com/)
- [Twilio](https://www.twilio.com/)
- [Kalidokit](https://github.com/yeemachine/kalidokit)