"use strict";

$(document).ready(function () {
  $('#dataTableSupply').DataTable({
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    "order": [[0, "desc"]],
    "scrollX": true,
    columns: [null, null, null, null, null, null, null, null, {
      orderable: false
    }]
  });
});