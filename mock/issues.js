export default {
  '/console/ListIssuesTrends' :{
    "Code": "Succeed",
    "Data": [
        {
          "Key": "Disposed",
          "Time": "05-31",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-31",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-30",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-30",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-01",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-01",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-02",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-02",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-03",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-03",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-04",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-04",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-05",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-05",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-06",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-06",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-07",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-07",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-08",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-08",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-09",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-09",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-11",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-11",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-12",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-12",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-13",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-13",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-14",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-14",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-15",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-15",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-16",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-16",
            "Value": 400
        },
        {
          "Key": "Disposed",
          "Time": "05-17",
          "Value": 400
        },
        {
            "Key": "Total",
            "Time": "05-17",
            "Value": 400
        },

    ],
    "Message": "Succeed",
    "RequestId": ""
},
  'GET /console/ListIsssuesTopHosts': {
    "Code": 200,
    "Message": "",
    "RequestId": '',
    "Data": {
      "Stat": [
        {
          "Index": 1,
          "Host": "erp.foobar.com",   
          "Count": 300,
        },                
        {
          "Index": 2,
          "Host": "oa.foobar.com",   
          "Count": 300,
        },                
        {
          "Index": 3,
          "Host": "erp.foobar.com",   
          "Count": 30,
        },                
        {
          "Index": 4,
          "Host": "shadow.foobar.com",   
          "Count": 400,
        },                
        {
          "Index": 5,
          "Host": "erp.foobar.com",   
          "Count": 300,
        },                
        {
          "Index": 6,
          "Host": "oa.foobar.com",   
          "Count": 300,
        },                
        {
          "Index": 7,
          "Host": "erp.foobar.com",   
          "Count": 30,
        },                
        {
          "Index": 8,
          "Host": "shadow.foobar.com",   
          "Count": 400,
        },        
      ]
    }
  },
  'GET /console/ListIssues' :    {
    "Code": "Succeed",
    "Data": {
        "Issues": [
            {
                "API": "https://192.168.1.1//v1/profile",
                "Confidence": "Certain",
                "Index": 1,
                "IssueId": 1,
                "IssueName": "SQL 注入漏洞",
                "RequestDetails": {
                    "raw_ascii": "xxxxxxxxxxx"
                },
                "ResponseDetails": {
                    "raw_ascii": "xxxxxxxxxxx"
                },
                "Severity": "High",
                "Status": "Undisposed",
                "TaskId": 1,
                "TaskRunId": 2,
                "UpdatedAt": "05-31T12:55:46"
            },            {
                "API": "https://192.168.1.1//v1/profile",
                "Confidence": "Certain",
                "Index": 2,
                "IssueId": 2,
                "IssueName": "SQL 注入漏洞",
                "RequestDetails": {
                    "raw_ascii": "xxxxxxxxxxx"
                },
                "ResponseDetails": {
                    "raw_ascii": "xxxxxxxxxxx"
                },
                "Severity": "High",
                "Status": "Undisposed",
                "TaskId": 1,
                "TaskRunId": 2,
                "UpdatedAt": "05-31T12:55:46"
            },
            ],
        "Total": 10
     },
    "Message": "Succeed",
    "RequestId": ""
},
  '/console/GetIssuesStat':   {
    "Code": 200,
    "Message": "",
    "RequestId": '',
    "Data": {
      "Stat": [
        {
          "Severity": "High",  // 威胁等级
          "Count": 1122,       // 数量
          "Increased": -0.12,   // 日增量
          "Proportion": 0.56,  // 圆形占比
        },        
        {
          "Severity": "Medium",  // 威胁等级
          "Count": 1122,       // 数量
          "Increased": 0.12,   // 日增量
          "Proportion": 0.56,  // 圆形占比
        },
        {
          "Severity": "Low",  // 威胁等级
          "Count": 1122,       // 数量
          "Increased": 0.12,   // 日增量
          "Proportion": 0.56,  // 圆形占比
        },        
        {
          "Severity": "Info",  // 威胁等级
          "Count": 1122,       // 数量
          "Increased": 0.12,   // 日增量
          "Proportion": 0.56,  // 圆形占比
        },
      ]
    }
  },
  '/console/GetIssueDetails':{
    "Code": "Succeed",
    "Data": {
        "API": "https://192.168.1.1//v1/profile",
        "Confidence": "Certain",
        "CreatedAt": "05-31T12:55:46",
        "Description": "这是一个 SQL 注入攻击",
        "IssueCategory": "web_vul",
        "IssueId": 2,
        "IssueName": "SQL 注入漏洞",
        "IssueType": "sqli",
        "IssueTypeId": 1,
        "References": "https://portswigger.net/web-security/sql-injection",
        "Remediation": "这是一个 SQL 注入攻击",
        "RequestDetails": {
            "raw_ascii": "request xxxxxxxxxxx"
        },
        "ResponseDetails": {
            "raw_ascii": "response xxxxxxxxxxx"
        },
        "Severity": "High",
        "Status": "Undisposed",
        "TaskId": 1,
        "TaskRunId": 2,
        "UpdatedAt": "05-31T12:55:46"
    },
    "Message": "Succeed",
    "RequestId": ""
},
}