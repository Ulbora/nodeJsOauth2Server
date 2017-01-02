/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
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
            testMysqlIndividualTestOnly: {
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file 
                    quiet: false, // Optionally suppress output to standard out (defaults to false) 
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
                },
                src: ['test/database/mysql/**/dbClientRedirectUriTest.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('mocha-mysqlTest', 'mochaTest:testMysql');
    grunt.registerTask('mocha-mysqlProcessorTest', 'mochaTest:testMysqlProcessors');
    grunt.registerTask('mocha-mysqlDbOnlyTest', 'mochaTest:testMysqlDbOnly');
    grunt.registerTask('mocha-mysqlDbIndividualOnlyTest', 'mochaTest:testMysqlIndividualTestOnly');

};
