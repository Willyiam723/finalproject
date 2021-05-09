// Ensure all contents are loaded
document.addEventListener('DOMContentLoaded', function() {

  // Contents to be rendered when Scenarios html is requested
  if (document.querySelector('#scenarios-view')) {
    
    // Allow user to inncrease a trade form slot when user request
    let add_form = document.querySelector('#add_form');
    let num_forms = document.getElementsByTagName('aside');
    let scenarios = document.querySelector('#scenarios');
    let postid = "";

    // Send request to add trade form slot as part of extra variable in url without affecting urls.py
    // Make sure number of form added increments and doesn't affet postid variable passed through url
    if (window.location.href.includes("?")) {
      let split_str_0 = window.location.href.split('?')[0];
      let split_str_1 = window.location.href.split('?')[1];
      if (split_str_1.includes("add")) {
        if (split_str_1.includes("postid")) {
          split_str_1 = split_str_1.split('&')[1];
          console.log(split_str_1);
        }
        else {
          split_str_1 = "";
        }
      }
      add_form.href = split_str_0 + `?add=${num_forms.length}`;
      if (split_str_1 !== "") {
        add_form.href = add_form.href + `&${split_str_1}`;
      }
    }
    else {
      add_form.href = window.location.href + `?add=${num_forms.length}`;
    }
    
    // Get postid if user is requesting for a specific post
    postid = Number(window.location.href.split('postid=')[1]);
    if (isNaN(postid )) {
      postid = "";
    }

    // Get postid if it's already available under post-id div
    if (document.querySelector('#post-id')) {
      postid = document.getElementById('#post-id').innerHTML;
      scenarios.innerHTML = `?postid=${postid}`;
      add_form.href = `?add=${num_forms.length}&postid=${postid}`;
    }

    // Make sure user only remove trades from a post rather than deleting from database
    // Therefore modifying each button's label and href accordingly
    if ((window.location.href.includes("postid=")) & (!window.location.href.includes("#"))) {
      let remove_button = document.getElementsByClassName("btn btn-sm btn-warning");
      let trade_ids = document.getElementsByClassName("extrades");
      let form = document.getElementById("form");
      form.action = `?postid=${postid}`;
      remove_button.innerHTML = "Remove from Post";
      for (let i=0; i < remove_button.length; i++) {
        remove_button[i].innerHTML = "Remove from Post";
        remove_button[i].href = `remove_from_post/${postid}/${trade_ids[i].innerHTML}`;
      }
      let delete_all_button = document.getElementById('delete-all-button');
      delete_all_button.innerHTML = "Clear all from Post";
      delete_all_button.href = `clear_all_from_post/${postid}`;

      // Unhide post user name for the post
      let post_user = document.getElementById('post_user');
      post_user.hidden = false;

    }

    // Get charts information on post or overall trades
    fetch(`charts/${postid}`)
    .then(response => response.json())
    .then(response => {
      console.log(response);

      // Assign response names for easier references
      let li = response.liquidity
      let le = response.leverage
      let tr_hqla = 0
      let tr_la = 0
      let tr_ila = 0
      let tr_sd = 0
      let tr_unsd = 0
      let tr_syn = 0

      // Pull info on trade impact
      response.trades.forEach(trade => trade_impact(trade));

      function trade_impact(trade) {
        if (trade.security === "HQLA") {
          tr_hqla += trade.amount;
          // li.hqla += tr_hqla;
        }
        if (trade.security === "LA") {
          tr_la += trade.amount;
          // li.la += tr_la;
        }
        if (trade.security === "ILA") {
          tr_ila += trade.amount;
          // li.ila += tr_ila;
        }
        if (trade.security === "Secured Debt") {
          tr_sd += trade.amount;
          // le.secured_debt += tr_sd;
        }
        if (trade.security === "Unsecured Debt") {
          tr_unsd += trade.amount;
          // le.unsecured_debt += tr_unsd;
        }
        if (trade.security === "Synthetics") {
          tr_syn += trade.amount;
          // le.synthetics += tr_syn;
        }
      }

      // Assign additional names for easier references in chart data/label
      const lmt_liq_y = 1.2;
      const lmt_lev_y = 0.5;
      const root = document.querySelector(':root');
      const his_chart = document.getElementById('hisTrend');
      let tot_a = li.hqla + li.la + li.ila + tr_hqla + tr_la + tr_ila
      let liq_a = li.hqla + li.la + tr_hqla + tr_la
      let tot_l_start = le.secured_debt + le.unsecured_debt + le.synthetics
      let tot_l = le.secured_debt + le.unsecured_debt + le.synthetics + tr_sd + tr_unsd + tr_syn
      let liq_ratio = (liq_a)/li.cash_outflow;
      let lev_ratio = (tot_l)/tot_a;

      // Prepare data and settings to render historical liquidity and leverage charts
      // Include historical and current ratios and limits
      let trace_liq = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', '2021-05-01 00:00:00', Date.now()],
          y: [1.23, 1.34, 1.27, 1.5, liq_ratio],
          type: 'scatter',
          mode: "lines",
          name: 'Liquidity Ratio',
          line: {color: '#7F7F7F'}
        };

      let trace_lev = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', '2021-05-01 00:00:00', Date.now()],
          y: [0.26, 0.25, 0.23, 0.3, lev_ratio],
          type: 'scatter',
          mode: "lines",
          name: 'Leverage Ratio',
          line: {color: '#17BECF'}
        };

        let lmt_liq = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', Date.now()],
          y: [lmt_liq_y, lmt_liq_y, lmt_liq_y, lmt_liq_y],
          mode: 'lines',
          name: 'Liquidity Limit',
          line: {
            dash: 'dashdot',
            width: 1,
            color: '#ec1848'
          }
        };

        let lmt_lev = {
          x: ['2021-02-01 00:00:00', '2021-03-01 00:00:00', '2021-04-01 00:00:00', Date.now()],
          y: [lmt_lev_y, lmt_lev_y, lmt_lev_y, lmt_lev_y],
          mode: 'lines',
          name: 'Leverage Limit',
          line: {
            dash: 'dashdot',
            width: 1,
            color: '#c6ec1d'
          }
        };

      let data_hisTrend = [trace_liq, lmt_liq, trace_lev, lmt_lev];
      
      let layout = { 
        margin: {
          l: 35,
          r: 35,
          b: 70,
          t: 30,
          pad: 0
        },
        autosize: true
      };

      let config = {responsive: true, displayModeBar: false}
      
      // Render historical liquidity and leverage charts
      Plotly.newPlot('hisTrend', data_hisTrend, layout, config);

      // Animation - send alert and set background color to warning if trades cause breaching to the limit
      if (liq_ratio < lmt_liq_y) {
        alert("Caution: Fund liquidity limits have been breached!");
        root.style.setProperty('--page-content-bgColor', '#f44336');
        his_chart.style.animation = 'shake 0.5s 5';
      }
      else if (lev_ratio > lmt_lev_y) {
        alert("Caution: Fund leverage limits have been breached!");
        root.style.setProperty('--page-content-bgColor', '#f44336');
        his_chart.style.animation = 'shake 0.5s 5';
      }
      else {
        root.style.setProperty('--page-content-bgColor', '#f0f1f6');
      }

      // Preparing data and settings to render asset composition chart
      let data_assetComp = [{
        type: 'funnel', 
        y: ["Total Asset", "LA and HQLA", "HQLA"], 
        x: [tot_a, liq_a, li.hqla + tr_hqla], 
        hoverinfo: 'x+percent previous+percent initial',
        marker: {color: ["59D4E8", "DDB6C6", "94D2E6"]}
      }];

      let layout_assetComp = {      
        xaxis: {
          tickfont: {family: "Lato"}
        },
        margin: {
          l: 75,
          r: 35,
          b: 70,
          t: 30,
          pad: 0
        },
        autosize: true,
        showlegend: false
        }
      
      // Render asset composition chart
      Plotly.newPlot('assetComp', data_assetComp, layout_assetComp, config);

      // Prepare data and settings to render liquidity impact chart
      liqImpact = document.getElementById('liqImpact');
      let data_liq = []

      // Assume cashoutflow is 200
      let tr_cof = -200
      
      // Set various chart displays so that columns with zero impact are hidden automatically
      // It's repetitive but couldn't find a more efficient way after researching
      if ((tr_hqla === 0) & (tr_la === 0)) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
          }
        ];
      }
      else if (tr_hqla === 0) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "LA",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_la}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_la,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
          }
        ];
      }
      else if (tr_la === 0) {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "HQLA",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_hqla}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_hqla,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else {
        data_liq = [
          {
              name: "liquidity surplus",
              type: "waterfall",
              orientation: "v",
              textposition: "outside",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Surplus",
                  "HQLA",
                  "LA",
                  "Cash Outflow",
                  "Ending Surplus"
              ],
              text: [
                  `${li.surplus}`,
                  `${tr_hqla}`,
                  `${tr_la}`,
                  `${tr_cof}`,
                  `${li.surplus + tr_hqla + tr_la + tr_cof}`
              ],          
              y: [
                  li.surplus,
                  tr_hqla,
                  tr_la,
                  tr_cof,
                  li.surplus + tr_hqla + tr_la
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      
      let layout_liq = {
          title: {
              text: "<b>Liquidity Surplus Impact</b>",
              tickfont: {family: "Lato"}
          },
          xaxis: {
              tickfont: {family: "Lato"},
              type: "category",
              automargin: true
          },
          yaxis: {
              tickfont: {family: "Lato"},
              type: "linear",
              showgrid: false,
              zeroline: true,
              showline: false,
              showticklabels: false,
              automargin: true
          },
          margin: {
            l: 10,
            r: 35,
            b: 70,
            t: 30,
            pad: 0
          },
          autosize: true,
          showlegend: false
      };

      // Render liquidity impact chart
      Plotly.newPlot('liqImpact', data_liq, layout_liq, config);

      // Prepare data and settings to render leverage impact chart
      levImpact = document.getElementById('levImpact');
      let data_lev = []

      // Set various chart displays so that columns with zero impact are hidden automatically
      // It's repetitive but couldn't find a more efficient way after researching
      if (tr_sd === 0 & tr_unsd === 0 & tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0 & tr_unsd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_syn,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0 & tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Unsecured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_unsd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_unsd,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_unsd === 0 & tr_syn ===0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_sd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Unsecured Debt",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_unsd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_unsd,
                  tr_syn,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_unsd === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_syn,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else if (tr_syn === 0) {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Unsecured Debt",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_unsd}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_unsd,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }
      else {
        data_lev = [
          {
              name: "leverage",
              type: "waterfall",
              orientation: "v",
              measure: [
                  "relative",
                  "relative",
                  "relative",
                  "relative",
                  "total"
              ],
              x: [
                  "Starting Leverage",
                  "Secured Debt",
                  "Unsecured Debt",
                  "Synthetics",
                  "Ending Leverage"
              ],
              textposition: "outside",
              text: [
                `${tot_l_start}`,
                `${tr_sd}`,
                `${tr_unsd}`,
                `${tr_syn}`,
                `${tot_l}`
              ],          
              y: [
                  tot_l_start,
                  tr_sd,
                  tr_unsd,
                  tr_syn,
                  tot_l
              ],
              connector: {
                line: {
                  color: "rgba(255, 209, 0, 0.2)"
                }
              },
              decreasing: { marker: { color: "rgba(255, 0, 247, 0.2)", line:{color : "red", width :1}}},
              increasing: { marker: { color: "rgba(0, 93, 255, 0.2)", line:{color : "green", width :1}} },
              totals: { marker: { color: "rbga(46, 120, 223, 0.2)", line:{color:'blue',width:1}}},
              cliponaxis: false
            }
        ];
      }

      let layout_lev = {
            title: {
                text: "<b>Leverage Impact</b>",
                tickfont: {family: "Lato"}
            },
            xaxis: {
                tickfont: {family: "Lato"},
                type: "category"
            },
            yaxis: {
                tickfont: {family: "Lato"},
                type: "linear",
                showgrid: false,
                zeroline: true,
                showline: false,
                showticklabels: false
            },
            margin: {
              l: 10,
              r: 35,
              b: 70,
              t: 30,
              pad: 0
            },
            autosize: true,
            showlegend: false
        };
      
      // Render leverage impact chart
      Plotly.newPlot('levImpact', data_lev, layout_lev, config);
    });

    // Make sure user can't choose to buy debts
    let selects = document.getElementsByTagName('select');

    for(let i=0; i<selects.length; i++) {
          selects[i].onchange = function() {
            if(selects[i].options[selects[i].selectedIndex].text === 'Buy') {
              for(let j=0; j<selects[i+1].options.length; j++) {
                  if((selects[i+1].options[j].text === 'Secured Debt') || (selects[i+1].options[j].text === 'Unsecured Debt') || (selects[i+1].options[j].text === 'Synthetics')) {
                    selects[i+1].options[j].disabled = true;
                  }
              }
              
            }
            else if((selects[i].options[selects[i].selectedIndex].text === 'Secured Debt') || (selects[i].options[selects[i].selectedIndex].text === 'Unsecured Debt') || (selects[i].options[selects[i].selectedIndex].text === 'Synthetics')) {
              for(let j=0; j<selects[i-1].options.length; j++) {
                  if(selects[i-1].options[j].text === 'Buy') {
                    selects[i-1].options[j].disabled = true;
                  }
              }
              
            }
            else if ((selects[i].options[selects[i].selectedIndex].text === 'HQLA') || (selects[i].options[selects[i].selectedIndex].text === 'LA') || (selects[i].options[selects[i].selectedIndex].text === 'ILA') || (selects[i].options[selects[i].selectedIndex].text === '---------')) {
              for(let j=0; j<selects[i-1].options.length; j++) {
                selects[i-1].options[j].disabled = false;
              }
            }
            else {
              for(let j=0; j<selects[i+1].options.length; j++) {
                selects[i+1].options[j].disabled = false;
              }
            }
          }
    }

    // Ensure buy amount offset sell amount in formset submitted
    let formset = document.getElementsByClassName('formset');

    // Build a div for warning message but hide it by default
    let message_text = "Please ensure Buy and Sell amount offset one another before submitting!"
    const button_wrapper = document.getElementById('button-wrapper');
    const submit_form = document.getElementById('submit-form');
    const message = document.createElement('div');
    message.className = "message";
    message.innerHTML = message_text;

    button_wrapper.appendChild(message);
    message.style.display = "none";

    // Make sure total Buy amount offsets total Sell amount
    for(let i=0; i<formset.length; i++) {
      formset[i].onchange = function() {
        let cum_amount = 0;
        console.log(formset[i].children[2].value);
        console.log(formset[i].children[6].value);
        for (let j=0; j<formset.length; j++) {
          if (formset[j].children[2].value === 'Buy') {
            cum_amount += Number(formset[j].children[6].value);
          }
          else if(formset[j].children[2].value === 'Sell') {
            cum_amount -= Number(formset[j].children[6].value);
          }
        }
        console.log(cum_amount)
        if (cum_amount !== 0) {
          console.log("Amounts must offset!")
          // Render the warning message
          message.style.display = "block";
          // Disable submit button
          submit_form.disabled = true;
          // Disappear on change
        }
        else if (cum_amount === 0) {
          // Hide the warning message
          message.style.display = "none";
          // Enable submit button
          submit_form.disabled = false;
        }
      }
    }

    // Enable update post content function when user is the creator of the post
    let post_user = document.getElementById('post_user').innerHTML
    post_user = post_user.replace('Creator: ', '');
    let username = document.getElementById('username').innerHTML
    username = username.replace('Hello, ', '');

    // Only update post content and time stamp when save scenario button is clicked
    if (post_user === username) {
      document.querySelector('#save-post').addEventListener('click', () => update_post(postid));
      
      // Allow user to update published post only user is the creator of post
      let publish_post = document.getElementById('publish-post');
      publish_post.hidden = false;
    }
    // Otherwise create a new scenario post when save button is clicked
    else {
      document.querySelector('#save-post').addEventListener('click', () => create_post());

      // Disable deleting trades if user is not creator
      let remove_button = document.getElementsByClassName("btn btn-sm btn-warning");
      for (let i=0; i < remove_button.length; i++) {
        remove_button[i].hidden = true;
      }
      let delete_all_button = document.getElementById('delete-all-button');
      delete_all_button.hidden = true;

      // Disable submit button if user is not creator 
      if (post_user !== '') {
        let submit_form = document.getElementById('submit-form');
        submit_form.disabled = true;
      }
    }
    
    // Function to update post content and time stamp
    function update_post(postid) {

      // Retrieve post information
      let post_id = '';
      if (postid === '') {
        post_id = document.getElementById('post-id').innerHTML;
      }
      else {
        post_id = postid;
      }
      let scenario_content = document.getElementById('scenario_content').value;
      
      // Update post information
      fetch('/create_post', {
        method: 'PUT',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            post_id: post_id,
            scenario_content: scenario_content,
            publish_post: ""
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
      });
    }
    
    // Function to create a new scenario post
    function create_post() {

      // Retrieve post information while setting fixed variables as const
      const extrades = document.getElementsByClassName('extrades');
      const content = document.getElementById('scenario_content').value;
      let trade_ids = []

      // Extract trade id from extrades
      for(let i=0; i<extrades.length; i++) {
        if (i === extrades.length - 1) {
          trade_ids += `${extrades[i].innerHTML}`;
        }
        else {
          trade_ids += `${extrades[i].innerHTML},`;
        }
      }

      trade_ids = trade_ids.split(',');
      
      // Create post information
      fetch('/create_post', {
        method: 'POST',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            trade_ids: trade_ids,
            content: content
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        // Reset value of the form after new scenario post created
        let publish_post = document.getElementById('publish-post');
        if (result.post.publish) {
          publish_post.innerHTML = "Unpublish";
        }
        else {
          publish_post.innerHTML = "Publish";
        }
        publish_post.hidden = false;

        let save_post = document.getElementById('save-post');
        save_post.innerHTML = "Save Scenario Description";

        const post_id = document.createElement('div');
        post_id.id = "post-id";
        post_id.innerHTML = result.post.id;
        const button_wrapper_header = document.getElementById('button-wrapper-header');
        button_wrapper_header.append(post_id);
        post_id.style.display = "none";
        window.location.assign(`/?postid=${result.post.id}`); 
      });
    }

    // Update a scenario post when publish button is clicked
    document.querySelector('#publish-post').addEventListener('click', () => publish_post(postid));
    
    // Function to update publishing
    function publish_post(postid) {

      // Retrieve post information
      let post_id = '';
      if (postid === '') {
        post_id = document.getElementById('post-id').innerHTML;
      }
      else {
        post_id = postid;
      }
      let publish_post = document.getElementById('publish-post').innerHTML;
      
      // Update post information
      fetch('/create_post', {
        method: 'PUT',
        // Send Django CSRF Token
        headers:{
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            post_id: post_id,
            publish_post: publish_post,
            scenario_content: ""
        })
      })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
        // Reset value of the form
        document.getElementById('publish-post').innerHTML = result.publish_post;
      });
    }

    // Show alert box
    let alertbox = document.getElementById('alert-box');

    // Send csv file to store in database
    Dropzone.autoDiscover = false;
    const myDropzone = new Dropzone('#my-dropzone', {
      url: 'upload/',
      init: function() {
        this.on('sending', function(file, xhr, formData){
          console.log('sending');
          formData.append('X-CSRFToken', getCookie('csrftoken'));
          formData.append('postid', postid);
        })
        this.on('success', function(file, response) {
          console.log(response.flag)
          // Render message in alert box to notify the uploading result
          if(response.flag) {
            alertbox.innerHTML = `${response.message}`;
            alertbox.className = "message-success";
            location.reload();
          }
          else {
            alertbox.innerHTML = `${response.message}`
            alertbox.className = "message";
          }
        })
      },
      maxFiles: 3,
      maxFilesize: 3,
      acceptedFiles: '.csv'
    })
  // End of scenario view
  }

  // Function to display pagination feature
  function pagination(page, num_pages, publish_post) {
      
    // Create pagination wrapper
    const pagination = document.createElement('ul');
    pagination.className = "pagination";
    pagination.innerHTML = "";
    document.getElementById("allposts").innerHTML = "";

    // Previous and page 1 button
    const previous = document.createElement('li');
    // Only enable previous page icon when current page is not 1
    if (page === 1) {
      previous.className = "page-item disabled";
    }
    else {
      previous.className = "page-item";
      if (publish_post) {
        previous.addEventListener('click', () => load_posts_published(page-1));
      }
      else {
        previous.addEventListener('click', () => load_posts(page-1));
      }
    }
    // Create link to navigate pages
    const prev_anchor = document.createElement('a');
    prev_anchor.className = "page-link";
    prev_anchor.innerHTML = "Previous";
    prev_anchor.href = "#";
    previous.append(prev_anchor);
    pagination.append(previous);

    // Pages in the middle
    // Loop through middle pages for navigation
    for (let page_item=1; page_item<=num_pages; page_item++) {
      const middle = document.createElement('li');
      if (page_item === page) {
        middle.className = "page-item active";
      }
      else {
        middle.className = "page-item";
        if (publish_post) {
          middle.addEventListener('click', () => load_posts_published(page_item));
        }
        else {
         middle.addEventListener('click', () => load_posts(page_item));
        }
      }
      // Create link to navigate pages
      const mid_anchor = document.createElement('a');
      mid_anchor.className = "page-link";
      mid_anchor.innerHTML = page_item;
      mid_anchor.href = "#";
      middle.append(mid_anchor);
      pagination.append(middle);
    }

    // Last and page max button
    const next = document.createElement('li');
    // Only enable last page icon when current page is not the maximum page
    if (page === num_pages) {
      next.className = "page-item disabled";
    }
    else {
      next.className = "page-item";
      if (publish_post) {
        next.addEventListener('click', () => load_posts_published(page+1));
      }
      else {
        next.addEventListener('click', () => load_posts(page+1));
      }
      }
    
    // Create link to navigate pages
    const next_anchor = document.createElement('a');
    next_anchor.className = "page-link";
    next_anchor.innerHTML = "Next";
    next_anchor.href = "#";
    next.append(next_anchor);
    pagination.append(next);

    // Append pagination wrapper to different views
    document.querySelector('#allposts').append(pagination);
  };

  // Function to display all posts
  function display_post(post, view) {
    
    // Create a wrapping div to append all displaying elements
    const post_block = document.createElement('div');
    post_block.className = "post_block";
    
    // Display user name of the post
    const user_name = document.createElement('div');
    user_name.className = "user_name";
    user_name.innerHTML = post.username;
    post_block.append(user_name);
    
    // Display content of the post
    const content = document.createElement('div');
    content.id = `${post.id}_post_content`;
    content.className = "post_content";
    content.innerHTML = post.content;
    post_block.append(content);

    // Display trade transaction of the post
    const num_trade = document.createElement('div');
    num_trade.className = "num_trade";
    num_trade.innerHTML = `Number of trades: ${post.num_trade}`;
    post_block.append(num_trade);

    // Display publishing status of the post
    const publish = document.createElement('div');
    publish.id = `${post.id}_post_publish`;
    publish.className = "post_publish";
    if (post.publish === true) {
      publish.innerHTML = "Published"
    }
    else {
      publish.innerHTML = "Private"
    }
    post_block.append(publish);
    
    // Display creation date time of the post
    const date_time = document.createElement('div');
    date_time.className = "date_time";
    const format_timestamp = format_datetime(new Date(post.date_time));
    date_time.innerHTML = format_timestamp;
    post_block.append(date_time);
    
    // Display number of likes of the post
    const num_like = document.createElement('div');
    num_like.className = "num_like";
    num_like.id = `${post.id}_num_like`;
    num_like.innerHTML = post.num_like;
    post_block.append(num_like);

    // Create like icon for post
    const heart = document.createElement('img');
    heart.className = "heart hvr-grow";
    heart.id = `${post.id}_heart`;
    heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
    post_block.append(heart);

    // Display anchor to get to the details in senarios page for the post
    const detail = document.createElement('a');
    detail.className = "detail";
    detail.id = `${post.id}_detail`;
    detail.innerHTML = "see Details & Edit >>>";
    detail.href = `?postid=${post.id}`;
    detail.href = detail.href.replace(`${view}`, '');
    post_block.append(detail);

    // Make sure user is eligible to like a post
    if (post.eligible_like) { 
      // Then check if user is already liking the post to display the right heart icon
      if (post.already_like) {
        heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
      }
      // Run like or unlike function once heart icon is clicked
      heart.addEventListener('click', () => like_unlike(post));
    }
    // If user is not eligible to like a post then hike the heart icon
    else {
      heart.style.display = 'none';
    }
    
    document.querySelector('#allposts').append(post_block);
  }

  // Function to like or unlike a post
  function like_unlike(post) {
    
    // Create like or unlike information
    fetch('/like', {
      method: 'POST',
      // Send Django CSRF Token
      headers:{
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
          post_id: post.id,
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
      // Update the heart icon
      const heart = document.getElementById(`${result.id}_heart`);
      if (result.already_like) {
      heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png";
      } else {
      heart.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Heart_icon_red_hollow.svg/812px-Heart_icon_red_hollow.svg.png";
      }
      // Update the number of likes
      const num_like = document.getElementById(`${result.id}_num_like`);
      num_like.innerHTML = result.num_like;
    });
  }

  // Contents to be rendered when Saved html is requested
  if (document.querySelector('#saved-view')) {
    
    // By default, load all posts
    load_posts(page=1);

    // Function to load all posts
    function load_posts(page) {

      // Get posts information
      fetch(`posts/${page}`)
      .then(response => response.json())
      .then(response => {
        pagination(page, response.num_pages, false);
        console.log(response.posts);
        // Display posts
        response.posts.forEach(post => display_post(post, 'saved'));
      });
    }
  // End of saved view
  }
  // Contents to be rendered when Shared html is requested
  if (document.querySelector('#shared-view')) {
    
    // By default, load all posts
    load_posts_published(page=1);

    // Function to load all posts
    function load_posts_published(page) {

      // Get posts information
      fetch(`posts_published/${page}`)
      .then(response => response.json())
      .then(response => {
        pagination(page, response.num_pages, true);
        console.log(response.posts);
        // Display posts
        response.posts.forEach(post => display_post(post, 'shared'));
      });
    }
  // End of shared view
  }

  // Assign variables for easier reference in dashboard cosmetic adjustments
  // For better user experience
  const html = document.documentElement;
  const body = document.body;
  const menuLinks = document.querySelectorAll(".admin-menu a");
  const collapseBtn = document.querySelector(".admin-menu .collapse-btn");
  const toggleMobileMenu = document.querySelector(".toggle-mob-menu");
  const switchInput = document.querySelector(".switch input");
  const switchLabel = document.querySelector(".switch label");
  const switchLabelText = switchLabel.querySelector("span:last-child");
  const collapsedClass = "collapsed";
  const lightModeClass = "light-mode";

  // Allow user to toggle collaps or expanding navagation menu
  collapseBtn.addEventListener("click", function () {
    body.classList.toggle(collapsedClass);
    this.getAttribute("aria-expanded") == "true"
      ? this.setAttribute("aria-expanded", "false")
      : this.setAttribute("aria-expanded", "true");
    this.getAttribute("aria-label") == "collapse menu"
      ? this.setAttribute("aria-label", "expand menu")
      : this.setAttribute("aria-label", "collapse menu");
  });

  // Allow user to toggle drop down for navagation menu when window is small as per media queries rule
  toggleMobileMenu.addEventListener("click", function () {
    body.classList.toggle("mob-menu-opened");
    this.getAttribute("aria-expanded") == "true"
      ? this.setAttribute("aria-expanded", "false")
      : this.setAttribute("aria-expanded", "true");
    this.getAttribute("aria-label") == "open menu"
      ? this.setAttribute("aria-label", "close menu")
      : this.setAttribute("aria-label", "open menu");
  });

  // Allow user to see tooltips when hovering over the menu items
  for (const link of menuLinks) {
    link.addEventListener("mouseenter", function () {
      if (
        body.classList.contains(collapsedClass) &&
        window.matchMedia("(min-width: 992px)").matches
      ) {
        const tooltip = this.querySelector("span").textContent;
        this.setAttribute("title", tooltip);
      } else {
        this.removeAttribute("title");
      }
    });
  }

  // Remember user's previous choice in selecting the Day/Night mode
  if (localStorage.getItem("dark-mode") === "false") {
    html.classList.add(lightModeClass);
    switchInput.checked = false;
    switchLabelText.textContent = "Day";
  }

  // Allow user to toggle between day or night mode
  switchInput.addEventListener("input", function () {
    html.classList.toggle(lightModeClass);
    if (html.classList.contains(lightModeClass)) {
      switchLabelText.textContent = "Day";
      localStorage.setItem("dark-mode", "false");
    } else {
      switchLabelText.textContent = "Night";
      localStorage.setItem("dark-mode", "true");
    }
  });

  // Function to display customized date format
  function format_datetime(date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();

    // Determing if time should be 'am' or 'pm'
    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    // The hour '0' should be '12'
    hour = hour ? hour : 12;
    // Minute less than 10 should have '0' displayed in first digit
    minute = minute < 10 ? '0'+minute : minute;
    
    return(`${month} ${day}, ${year}, ${hour}:${minute} ${ampm}`);
  }

  // Function to get CSRF token
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Function to pause in milliseconds
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
});