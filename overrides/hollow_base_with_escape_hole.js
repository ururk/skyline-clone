let overrides = {
	fontSize: 5,
	fontExtrude: 1,	// How much to extrude the font from the face of the base
	fontFamily: 'Helvetica:style=Bold', // See https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Text

	logoExtrude: 1, // How much to extrude the logo from the face of the base

	cubeSize: 2.574, // Cube size is set directly, keep in mind 53 need to fit on the base in the long direction, and 7 in the narrow

	baseHeight: 9, // How tall the base is
	baseWidth: 150, // How wide the base is
	baseDepth: 30, // How deep the base is
	baseAngle: 69, // Angle on the sides

	wallThickness: 3*.4, // If you want to export a hollow base, change this. It should be a multiple of your extruder size (ie, 1.2 when printing with a .4mm nozzle)
	platformThickness: 2.4, // Only applies if you set wallThickness. This controls the top thickness - probably want it thicker than the side walls. The part is small enough it should be able to bridge without support
	bottomThickness: 1.2, // Only applies if you set wallThickness. Will generate a thin bottom If > 0, no bottom if < 0.
	escapeHole: 'true' // Useful if you want to print this in metal, as the reclaimed powder may be deducted from the cost depending on 3D print provider.
}

module.exports = {
	overrides: overrides
};