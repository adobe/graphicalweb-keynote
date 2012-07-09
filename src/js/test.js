
define(['graphicalweb/utils/CSS3Helper',
	'graphicalweb/Model',
	'graphicalweb/controllers/CameraController'],
	function (CSS3Helper, Model, Camera) {

//CSS3Helper
		test('CSS3Helper.setTransform()', function () {
			var testobj = {style: {}},
				translateString = 'translate3d(100px, 100px, 100px)';

			CSS3Helper.setTransform(testobj, translateString);

		  	expect(3);
			equal(testobj.style.webkitTransform, translateString, "webkit transform works");
			equal(testobj.style.MozTransform, translateString, "moz transform works");
			equal(testobj.style.Transform, translateString, "transform works");
		});

		test('CSS3Helper.setTransformOrigin()', function () {
			var testobj = {style: {}},
				translateString = '100px, 100px';

			CSS3Helper.setTransformOrigin(testobj, translateString);

		  	expect(3);
			equal(testobj.style.webkitTransformOrigin, translateString, "webkit transform origin works");
			equal(testobj.style.MozTransformOrigin, translateString, "moz transform origin works");
			equal(testobj.style.TransformOrigin, translateString, "transform origin works");
		});

		test('CSS3Helper.setPerspectiveOrigin()', function () {
			var testobj = {style: {}},
				translateString = '100px, 100px';

			CSS3Helper.setPerspectiveOrigin(testobj, translateString);

		  	expect(3);
			equal(testobj.style.webkitPerspectiveOrigin, translateString, "webkit perspective origin works");
			equal(testobj.style.MozPerspectiveOrigin, translateString, "moz perspective origin works");
			equal(testobj.style.PerspectiveOrigin, translateString, "perspective origin works");
		});

		test('CSS3Helper.setPerspective()', function () {
			var testobj = {style: {}},
				translateString = '1000';

			CSS3Helper.setPerspective(testobj, translateString);

		  	expect(3);
			equal(testobj.style.webkitPerspective, translateString, "webkit perspective works");
			equal(testobj.style.MozPerspective, translateString, "moz perspective works");
			equal(testobj.style.Perspective, translateString, "perspective works");
		});

//Model tests
		var model = new Model(),
			states = model.getStates();

		test('model.getStateByTitle', function () {
			var state = model.getStateByTitle('Div');

			equal(state.id, states[1].id, 'getStateByTitle("Div") id = 1');
			equal(state.url, states[1].url, 'getStateByTitle("Div") url = "meet-div"');
		});

		test('model.getStateByInt', function () {
			var state = model.getStateByInt(1);

			equal(state.id, states[1].id, 'getStateByInt works id');
			equal(state.url, states[1].url, 'getStateByInt works url');
		});

		test('model.setCurrentState', function () {
			model.setCurrentState(1);
			var state = model.getCurrentState();

			equal(state.id, 1, 'getCurrentState matches value set using setCurrentState');
		});

//Camera tests
		test('Camera.setPosition', function () {
			var pos = {x: 100, y: 200, z: -400};
			Camera.setPosition(pos.x, pos.y, pos.z);

			equal(Camera.position.x, pos.x, 'position x set');
			equal(Camera.position.y, pos.y, 'position y set');
			equal(Camera.position.z, pos.z, 'position z set');
		});

		test('Camera.setRotation', function () {
			var rot = {x: 100, y: 200, z: -400};
			Camera.setRotation(rot.x, rot.y, rot.z);

			equal(Camera.rotation.x, rot.x, 'rotation x set');
			equal(Camera.rotation.y, rot.y, 'rotation y set');
			equal(Camera.rotation.z, rot.z, 'rotation z set');
		});

		test('Camera.setPerspective', function () {
			var p = 1000;
			Camera.setPerspective(p);

			equal(Camera.perspective.value, p, 'perspective set');
		});
});

