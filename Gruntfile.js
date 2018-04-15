/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mask: '**/*Test.js'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/**/*Test.js']
            },
            testMysql: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/database/mysql/**/*Test.js']
            },
            testMysqlProcessors: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/database/mysql/processors/**/*Test.js']
            },
            testMysqlDbOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/database/mysql/**/db*Test.js']
            },
            testDbOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/database/**/db*Test.js']
            },
            testWebOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/webControllers/**/*Test.js']
            },
            testManagersOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/managers/**/*Test.js']
            },
            testServicesOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/services/**/*Test.js']
            },
            testIndividualTestOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
               //src: ['test/webControllers/authorizeControllerTest.js']
               //src: ['test/webControllers/loginControllerTest.js']
               //src: ['test/webControllers/tokenControllerTest.js']
                //src: ['test/database/dbClientTest.js']
                //src: ['test/database/mysql/dbClientTest.js']
                //src: ['test/database/mysql/processors/clientProcessorTest.js']
                //src: ['test/managers/clientAllowedUriManagerTest.js']
                //src: ['test/managers/clientRedirectUriManagerTest.js']
                ///src: ['test/managers/managerTest.js']
                //src: ['test/delegates/accessTokenDelegateTest.js']
                // src: ['test/delegates/implicitGrantDelegateTest.js']
                src: ['test/services/tokenValidationServiceTest.js']
                //src: ['test/oauth2/oauth2Test.js']
                //src: ['test/proxy/userProxyTest.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.registerTask('coverage-test-all', 'mocha_istanbul:coverage');
    grunt.registerTask('mocha-test-all', 'mochaTest:test');
    grunt.registerTask('mocha-mysqlTest', 'mochaTest:testMysql');
    grunt.registerTask('mocha-mysqlProcessorTest', 'mochaTest:testMysqlProcessors');
    grunt.registerTask('mocha-mysqlDbOnlyTest', 'mochaTest:testMysqlDbOnly');
    grunt.registerTask('mocha-DbOnlyTest', 'mochaTest:testDbOnly');
    grunt.registerTask('mocha-WebOnly', 'mochaTest:testWebOnly');
    grunt.registerTask('mocha-Managers', 'mochaTest:testManagersOnly');
    grunt.registerTask('mocha-Services', 'mochaTest:testServicesOnly');
    grunt.registerTask('mocha-IndividualOnlyTest', 'mochaTest:testIndividualTestOnly');

};
