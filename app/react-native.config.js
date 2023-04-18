/// <reference types="react-native-windows" />

module.exports = {
  project: {
    windows: {
      folder: "windows",
      sourceDir: "../frontend/windows",
      solutionFile: "frontend.sln",
      project: {
        projectFile: "frontend\\frontend.vcxproj",
      },
    },
    macos: {
      folder: "macos",
      sourceDir: "../frontend/macos",
      pbxprojPath: "frontend.xcodeproj/project.pbxproj",
      podfile: "Podfile",
      podspecPath: "frontend.podspec",
    },
  },
};
