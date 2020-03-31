// Use D3 to read in samples data
d3.json("static/samples.json").then(function(data) {
    console.log(data);

    // Code to populate dropdown menu with options for individuals
    var select = document.getElementById("selectIndividual");
    var options = data.names

    for (var i = 0; i < options.length; i++) {
        var opt = options[i]
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    };

    // Run function to generate bar graph, bubble chart, and meta data upon selection of option 
    d3.selectAll("#selectIndividual").on("change", generateGraphs);

    function generateGraphs() {
        // Use D3 to select dropdown menu
        var dropdownMenu = d3.select("#selectIndividual");
        // Assign the value of the dropdown menu option to a variable
        var individual = dropdownMenu.property("value");
        // Filter data to selected individual
        var individualData = data.samples.filter(function(i) {
            return i.id === individual;
          });

          // Get data for Top 10 OTUs for individual
          top10OTUs = individualData[0].otu_ids.slice(0,10);
          top10SampleValues = individualData[0].sample_values.slice(0,10);
          top10OTULabels = individualData[0].otu_labels.slice(0,10);

          // Trying to figure out how to access data
        //   console.log(individualData);
        //   console.log(top10OTUs);
        //   console.log(individualData[0].otu_ids);
        //   console.log(top10SampleValues);

          // Create necessary variables for bar chart
          var trace1 = {
              x: top10SampleValues,
              y: top10OTUs,
              text: top10OTULabels,
              type: "bar",
              orientation: 'h'
          };
          var layout = {
              title: `Top 10 OTUs Found in Individual ${individual}`,
              yaxis: {
                  tickmode: "array",
                  tickvals: [1,2,3,4,5,6,7,8,9,10],
                  ticktext: top10OTUs.toString(),
                  title: "OTU ID"
              },
              xaxis: {
                  title: "Frequency"
              }
          };

          // Generate bar chart
          var barGraphData = [trace1]
          Plotly.newPlot("bar-chart", barGraphData, layout);

          // Generate bubble chart with all data for the individual
          var trace2 = {
              x: individualData[0].otu_ids,
              y: individualData[0].sample_values,
              text: individualData[0].otu_labels,
              mode: 'markers',
              marker: {
                  size: individualData[0].sample_values
              }
          };

          var bubbleGraphData = [trace2]
          var layout2 = {
              title: `All OTUs Found on Individual ${individual}`,
              xaxis: {
                  title: 'OTU ID'
              },
              yaxis: {
                  title: 'Frequency'
              }
          };

          Plotly.newPlot("bubble-chart", bubbleGraphData, layout2);
        
          // Populate metadata for the individual
          var individualMetaData = data.metadata.filter(function(i) {
            return i.id.toString() === individual;
          });

          document.getElementById("individual-id").textContent = `Individual ID: ${individualMetaData[0].id}`;
          document.getElementById("ethnicity").textContent = `Ethnicity: ${individualMetaData[0].ethnicity}`;
          document.getElementById("gender").textContent = `Gender: ${individualMetaData[0].gender}`;
          document.getElementById("location").textContent = `Location: ${individualMetaData[0].location}`;
          document.getElementById("bbtype").textContent = `Bellybutton Type: ${individualMetaData[0].bbtype}`;
    }


});