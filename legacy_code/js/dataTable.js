$(document).ready(function() {
    $('#dataTable').DataTable( {
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "order": [[ 1, "desc" ],[ 9, "desc" ]],
        "scrollX": true,
        columns: [null,null,null,null,null,null,null,null,null,null,
            { orderable: false },
          ]
    } );
} );

$(document).ready(function() {
    $('#dataTableProducts').DataTable( {
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "order": [[ 1, "desc" ]],
        "scrollX": true,
        columns: [null,null,null,null,null,null,null,null,null,
            { orderable: false },
          ]
    } );
} );

$(document).ready(function() {
    $('#dataTableSupply').DataTable( {
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "order": [[ 0, "desc" ]],
        "scrollX": true,
        columns: [null,null,null,null,null,null,null,null,
            { orderable: false },
          ]
    } );
} );