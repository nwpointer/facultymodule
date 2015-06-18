<?php 

function getOptionsfrom($taxonomy){
  $terms = array();
  $myvoc = taxonomy_vocabulary_machine_name_load($taxonomy);
  $tree = taxonomy_get_tree($myvoc->vid);
  foreach ($tree as $term) {
   array_push($terms, $term->name);
  }
  return $terms;
}

function selectFrom($taxonomy){
  $terms = array();
  $options = array();
  $html = ' ';
  foreach ($taxonomy as $term) {
    array_push($terms, $term);
    array_push($options, getOptionsfrom($term));
  }


  
  $html .= renderSelect('filter', $terms);
  // $html .= '<select id="placeholder"></select>';
  foreach ($options as $key => $value) {
    $html .= renderSelect($terms[$key], $value); 
  }
  return $html;
}

function renderSelect($term, $options){
    $html = '<select name="filter" id="' . strtok($term, " ") . '">';
    $html .= '<option selected disabled value="null">' . $term . '</option>';
    foreach ($options as $value) {
      $html .= '<option value="' . $value . '">' . $value . '</option>';
    }
    $html .= '<option id="reset" value="reset">reset</option>';
    $html .= '</select>';
    return $html;
}

function loadjs($scripts, $location = "footer"){
	$program_module_path = drupal_get_path('module', 'program');
	
	foreach ($scripts as $src) {
		drupal_add_js($program_module_path . $src, array('scope'=>$location) );	
	}
}

function loadcss($styles){
	$program_module_path = drupal_get_path('module', 'program');

	foreach($styles as $style ){
		drupal_add_css(
			$program_module_path . $style, array('group' => CSS_DEFAULT, 'type' => 'file')
		);
	}
}