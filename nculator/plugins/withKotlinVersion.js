const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = (config) =>
  withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Upgrade Kotlin from 1.9.24 → 1.9.25 (Compose Compiler 1.5.15 requires 1.9.25)
    if (contents.includes('kotlinVersion = "1.9.24"')) {
      contents = contents.replace(
        'kotlinVersion = "1.9.24"',
        'kotlinVersion = "1.9.25"'
      );
    }

    // Belt-and-suspenders: suppress the version check as well
    if (!contents.includes('suppressKotlinVersionCompatibilityCheck')) {
      contents += `
allprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            freeCompilerArgs += [
                "-P",
                "plugin:androidx.compose.compiler.plugins.kotlin:suppressKotlinVersionCompatibilityCheck=true"
            ]
        }
    }
}
`;
    }

    config.modResults.contents = contents;
    return config;
  });
