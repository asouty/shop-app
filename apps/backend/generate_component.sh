read -p "component name: " component;
cd ./src/component/
nest generate module $component;
nest generate controller $component;
nest generate service $component;
