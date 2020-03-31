define([
    'jquery',
    'underscore',
    'api/SplunkVisualizationBase',
    'api/SplunkVisualizationUtils',
    'd3',
    'billboard.js'
  ],
  function (
    $,
    _,
    SplunkVisualizationBase,
    SplunkVisualizationUtils,
    d3,
    billboard
  ) {

    return SplunkVisualizationBase.extend({

      initialize: function () {
        // Save this.$el for convenience
        this.$el = $(this.el);

        // Add a css selector class
        this.$el.addClass('splunk-radial-meter');
      },

      getInitialDataParams: function () {
        return ({
          outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
          count: 10000
        });
      },

      /* formatData: function (data) {
        // Format data
        console.log(data);
        if (data.rows.length < 1) {
          return false;
        }
        var datum = SplunkVisualizationUtils.escapeHtml(parseFloat(data.rows[0][0]));

        console.log(datum);

        if (_.isNaN(datum)) {
          throw new SplunkVisualizationBase.VisualizationError("This viz is only supports number");
        }
        return data;
      }, */

      updateView: function (data, config) {
        console.log(data);
        console.log(config);

        if (data.rows.length < 1) {
          return false;
        }

        var datas = [];
        data.fields.forEach(function (el, idx) {
          datas[idx] = new Array(el.name);
        });

        data.rows.forEach(function (el) {
          for (i = 0; i < el.length; i++) {
            datas[i].push(el[i])
          }
        });
        let timeFormat = "";
        let bindId = config["display.visualizations.custom.viz_billboard_app.billboard.bindId"]

        if (bindId == undefined) {
          return false;
        }

        // 날짜  YYYY-MM-DD
        var dayRegExp = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/;

        // 복합 YYYY-MM-DD HH24:mm (중간 공백)
        var dayTimeRegExp = /^(19|20|21)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])\s([1-9]|[01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        console.log(bindId);

        if (dayRegExp.test(datas[0][1])) {
          timeFormat = "%Y-%m-%d";
        }

        if (dayTimeRegExp.test(datas[0][1])) {
          timeFormat = "%Y-%m-%d %H:%M:%S";
        }

        var chart = billboard.bb.generate({
          data: {
            x: "x",
            xFormat: timeFormat,
            columns: datas
          },
          axis: {
            x: {
              type: "timeseries",
              tick: {
                format: timeFormat
              }
            }
          },
          tooltip: {
            linked: true
          },
          bindto: bindId
        });
      }
    });
  });