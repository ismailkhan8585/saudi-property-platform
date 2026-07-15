const{auditCoverage,writeReport,REPORT_PATH}=require('./search-coverage-core.cjs');
auditCoverage().then(report=>{writeReport(report);console.log(JSON.stringify({report:REPORT_PATH,counts:report.counts},null,2))}).catch(error=>{console.error(error instanceof Error?error.message:error);process.exitCode=1});
