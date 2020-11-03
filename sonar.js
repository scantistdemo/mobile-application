const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'Server URL' , //  default to http://localhost:9000,
        options : {
            'sonar.projectKey' : 'mobile-applications',
            'sonar.sources':  'src',
            // 'sonar.tests':  'src/test', //  test case files ignored
            'sonar.exclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx,src/**/*.spec.ts,src/**/*.spec.tsx,src/**/*.test.ts,src/**/*.test.tsx,src/test/**',
            'sonar.test.exclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx,src/**/*.spec.ts,src/**/*.spec.tsx,src/**/*.test.ts,src/**/*.test.tsx,src/test/**',
            'sonar.javascript.lcov.reportPaths':  'coverage/lcov.info',
             }
    }, () => {});

