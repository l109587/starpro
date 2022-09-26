export default {
  // GET POST 可省略
  'GET /console/listEvents': {
    "Code": 'Succeed',
    "Message": "",
    "RequestId": '',
    "Data": {
      "Total": 40,
      "APITotal": 36,
      "Events": [
        {
           "Index": 1,
           "EventId": 1,
           "EventName": "SQL 注入攻击",
           "Category": "web_attack",
           "Type": "sqli",
           "Severity": "High",
           "Confidence": "Certain",
           "AttackerSrcHost": "192.168.1.1",
           "Scheme": "Https",
           "Host": "erp.foobar.com",
           "Path": "/v1/profile",
           "RequestDetails": {
              "raw_ascii": "xxxxxx",
              "raw_base64": "xxxxxxx",
           },                      
           "ResponseDetails": {
              "raw_ascii": "xxxxxx",
              "raw_base64": "xxxxxxx",
           },
           "API": "http://erp.foobar.com/v1/profilehiuihkjhiuhkjhiuhijhniuh",           
           "Status": "Undisposed",           
           "Apps": [
           {
              "AppId": 1,
              "Name": "Dev"
           },
           {
              "AppId": 2,
              "Name": "Staging"
           }],           
           "CreatedAt": 1561392000000,
           "UpdatedAt": 1561392000000
         },        
         {
           "Index": 2,
           "EventId": 2,
           "Severity": "Low",
           "Domain": "baz.com",
           "CreatedAt": 1561392000000,
           "UpdatedAt": 1561392000000
         },        
         {
           "Index": 3,
           "EventId": 3,
           "EventName": "SQL 注入攻击",
           "Category": "web_attack",
           "Type": "sqli",
           "Severity": "Medium",
           "Confidence": "Certain",
           "AttackerSrcHost": "192.168.1.1",
           "Scheme": "Https",
           "Host": "erp.foobar.com",
           "Path": "/v1/profile",
           "RequestDetails": {
              "raw_ascii": "xxxxxx",
              "raw_base64": "xxxxxxx",
           },                      
           "ResponseDetails": {
              "raw_ascii": "xxxxxx",
              "raw_base64": "xxxxxxx",
           },
           "API": "http://erp.foobar.com/v1/profile",           
           "Status": "Undisposed",           
           "Apps": [
           {
              "AppId": 1,
              "Name": "Dev"
           },
           {
              "AppId": 2,
              "Name": "Staging"
           }],           
           "CreatedAt": 1561392000000,
           "UpdatedAt": 1561392000000
         },
         {
          "Index": 4,
          "EventId": 4,
          "EventName": "SQL 注入攻击",
          "Category": "web_attack",
          "Type": "sqli",
          "Severity": "Info",
          "Confidence": "Certain",
          "AttackerSrcHost": "192.168.1.1",
          "Scheme": "Https",
          "Host": "erp.foobar.com",
          "Path": "/v1/profile",
          "RequestDetails": {
             "raw_ascii": "xxxxxx",
             "raw_base64": "xxxxxxx",
          },                      
          "ResponseDetails": {
             "raw_ascii": "xxxxxx",
             "raw_base64": "xxxxxxx",
          },
          "API": "http://erp.foobar.com/v1/profile",           
          "Status": "Undisposed",           
          "Apps": [
          {
             "AppId": 1,
             "Name": "Dev"
          },
          {
             "AppId": 2,
             "Name": "Stagingfsadfaewrsadfasdfew"
          }],           
          "CreatedAt": 1561392000000,
          "UpdatedAt": 1561392075000
        },        
      ]
    }
  },
  'GET /console/GetEventsStateTrend':   {
    "Code": 'Succeed',
    "Message": "",
    "RequestId": '',
    "Data": {
      "Total": 10,
      "Stat": {
        "Increased": 1245, // 按天计算，和前一天比较，有负值
        "Current": 12345,  
        "Trends": [
        10, 20, 30, 40, 50, 60, 10, 10
        ],
        "Count": 10,
      }
    }
  },
  'GET /console/ListEventsTrends':   {
    "Code": 'Succeed',
    "Message": "",
    "RequestId": '',
    "Data": [
        {
           "Index": 1,
           "Key": "Disposed",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
           "Time": "2020-01",
           "Value": 400,
         },        
         {
           "Index": 1,
           "Key": "Total",   // 威胁趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
           "Time": "2020-01",
           "Value": 300,
         },                 
      //    {
      //      "Index": 1,
      //      "Key": "Info",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //      "Time": "2020-01",
      //      "Value": 100,
      //    },  
      //    {
      //     "Index": 1,
      //     "Key": "Medium",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //     "Time": "2020-01",
      //     "Value": 'Succeed',
      //   },
      //   {
      //     "Index": 1,
      //     "Key": "Low",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //     "Time": "2020-02",
      //     "Value": 400,
      //   },        
      //   {
      //     "Index": 1,
      //     "Key": "High",   // 威胁趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //     "Time": "2020-02",
      //     "Value": 500,
      //   },                 
      //   {
      //     "Index": 1,
      //     "Key": "Info",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //     "Time": "2020-02",
      //     "Value": 700,
      //   },  
      //   {
      //    "Index": 1,
      //    "Key": "Medium",   // 处置趋势 -&gt; (Disposed - 已处置，Undisposed - 未处置) , 威胁趋势 -&gt; (High - 高危，Medium - 中危，Low - 低危，Info - 信息)
      //    "Time": "2020-02",
      //    "Value": 'Succeed',
      //  },       
      ]
  },
  'GET /console/ListEventsTopHosts':   {
    "Code": 'Succeed',
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
  'Get /console/GetEventDetails':   {
    "Code": 'Succeed',
    "Message": "",
    "RequestId": '',
    "Data": {
      "Name": "SQL注入攻击",  // 事件名称
      "Host" : '343',
      "Category": "web_attack", // 类型 -&gt; web_attack(Web 攻击)
      "Severity": "High", // 威胁等级 -&gt; High(高)\Medium(中)\Low(低)\Info(信息)
      "Confidence": "Firm", // 准确程度 -&gt; Certain\Firm\Tentative
      "Schema": "https",  // 协议 -&gt; http/https
      "Method": "GET",    // 请求方法 -&gt; GET/POST
      "Path": "/v1/profile",  // 路径
      "AttackerSrcHost": "192.168.1.1",  // 攻击者源
      "CreatedAt": 11111111111 , //发现时间，时间戳
      "UpdatedAt": 11111111111 , //最新时间，时间戳
      "Apps": [ // 影响应用
        {
          "AppId": 1,
          "AppName": "游戏应用",
        },
        {
          "AppId": 2,
          "AppName": "视频应用",
        },
        {
          "AppId": 3,
          "AppName": "游戏应用",
        },
        {
          "AppId": 4,
          "AppName": "视频应用",
        },
        {
          "AppId": 5,
          "AppName": "游戏应用",
        },
        {
          "AppId": 6,
          "AppName": "视频应用",
        },
        {
          "AppId": 7,
          "AppName": "游戏应用",
        },
        {
          "AppId": 8,
          "AppName": "视频应用",
        }
      ],
      "Description": "由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....",  // 事件描诉
      "Details": "<html> <h2>titl</h2> <div>123</div> <div>2345</div>  </html>",  // 事件详情
      "Remediation": "通过 xxx ",  // 安全建议
      "References": "通过 xxx ",  // 相关参考
      "ResponseRaw": "xxxxxx",    // 原始响应
      "RequestRaw": "由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....由于业务系统在处理用户请求时，没有对....",  // 事件描诉
    }
  },
  'POST /console/UpdateEventStatus': {
    "Code": 'Succeed',
    "Message": "",
    "RequestId": '',
    "Data": { }
  }
};