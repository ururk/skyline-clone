year = "<%= year %>";
username = "<%= username %>";

fontSize = <%= fontSize %>;
fontExtrude = <%= fontExtrude %>;
fontFamily = "<%= fontFamily %>";

logoExtrude = <%= logoExtrude %>;

cubeSize = <%= cubeSize %>;

baseHeight = <%= baseHeight %>;
baseWidth = <%= baseWidth %>;
baseDepth = <%= baseDepth %>;
baseAngle = <%= baseAngle %>;

subtractor = baseHeight/tan(baseAngle);

baseTopWidth = baseWidth - subtractor*2;
baseTopDepth = baseDepth - subtractor*2;

// If you enter a value for wallThickness you must enter one for platformThickness
wallThickness = <%= wallThickness %>; // If you want to export a hollow base
platformThickness = <%= platformThickness %>; // This controls the top thickness - probably want it thicker than the side walls The part is small enough it should be able to bridge without support

bottomThickness = <%= bottomThickness %>; // Only applies if you set wallThickness. Will generate a thin bottom If > 0, no bottom if < 0.

// Related to the settings directly above
shellSubtractor = bottomThickness / tan(baseAngle); // used to determine how big to draw the base
platformSubtractor = platformThickness / tan(baseAngle); // used to determine how big to draw the top INNER platform

escapeHole = <%= escapeHole %>;

// Grid area - 53 weeks x 7 days/week
topAreaWidth = 53 * cubeSize;
topAreaHeight = 7 * cubeSize;

// Starting positions for the grid
leftStartingPosition = topAreaWidth / 2;
topStartingPosition = topAreaHeight / 2;

// Amount to shift fonts up so they are centered on the base
verticalFontSpacing = (baseHeight - fontSize)/2;

completeBase();
logo();
leftText(username);
rightText(year);
//referenceStl(); // uncomment to show the original STL

pad = .1; // Amount to overlap shapes
cubePad = .1; // Amount to grow the cubes so that touching surfaces are made into one piece

<%= drawCubeCalls %>

module drawCube(height, x, y) {
    finalCubeHeight = height*14*1.8;
    // Translate starting position
    translate([-leftStartingPosition, topStartingPosition, baseHeight]) {
        // This now starts translating from a 0,0 starting point
        translate([x*cubeSize, -y*cubeSize, 0]) {
            color("red") {
                translate([cubeSize/2, -cubeSize/2, (finalCubeHeight-pad)/2]) {
                    cube([cubeSize+cubePad, cubeSize+cubePad, finalCubeHeight+pad], center=true);
                }
            }
        }
    }
}

module completeBase(baseAngle) {
    difference() {
        base(baseWidth, baseDepth, baseHeight, baseTopWidth, baseTopDepth);

        color("green") {
            if (wallThickness > 0 && (bottomThickness > 0 || bottomThickness < 0)) {
                // We are going to shift it down so it subtracts cleanly

                // shellSubtractor is the amount we need to change when shifting the shape up or down

                // platformSubtractor is the amount for the top shape

                translate([0, 0, bottomThickness]) {
                   base(
                    baseWidth - shellSubtractor*2 - wallThickness*2,
                    baseDepth - shellSubtractor*2 - wallThickness*2,

                    baseHeight - platformThickness - bottomThickness,

                    baseTopWidth + platformSubtractor*2 - wallThickness*2,
                    baseTopDepth + platformSubtractor*2 - wallThickness*2
                   );
                }
            }

            if (bottomThickness > 0 && escapeHole == true) {
                translate([0, 0, bottomThickness/2]) {
                    cylinder(r=4, h=bottomThickness + 2*pad, center = true);
                }
            }
        }
    }
}

module base(bottomWidth, bottomDepth, height, topWidth, topDepth) {
    translate([0, 0, 0]) {
        BasePoints = [
            [  -bottomWidth/2,  -bottomDepth/2,  0 ],
            [  bottomWidth/2,  -bottomDepth/2,  0 ],
            [  bottomWidth/2,  bottomDepth/2,  0 ],
            [  -bottomWidth/2,  bottomDepth/2,  0 ],
            [ -topWidth/2,  -topDepth/2,  height ],
            [ topWidth/2,  -topDepth/2,  height ],
            [ topWidth/2,  topDepth/2,  height ],
            [ -topWidth/2,  topDepth/2,  height ]
        ];

        BaseFaces = [
            [0,1,2,3],
            [4,5,1,0],
            [7,6,5,4],
            [5,6,2,1],
            [6,7,3,2],
            [7,4,0,3]
        ];

        polyhedron(BasePoints, BaseFaces);
    }
}

module logo() {
    translate([-(baseWidth/2-10.9), -baseDepth/2, 0]) {
        rotate([baseAngle, 0, 0]) {
            // shift up along the sloped face, and sink into the base so the mesh is calculated properly
            translate([0, 1.1, -pad]) {
                color("green") {
                    linear_extrude(logoExtrude+pad) {
                        scale([.194, .194, 1]) {
                            // Path is relative to .scad file, not where it is called from on the command line
                            import("../src/octocat_logo.svg");
                        }
                    }
                }
            }
        }
    }
}

module referenceStl() {
    translate([0, .57, 4.486]) {
        import("file-from-skyline-website.stl");
    }
}

module leftText(username) {
    translate([-(baseWidth/2-20.1), -baseDepth/2, 0]) {
        rotate([baseAngle, 0, 0]) {
            translate([0, verticalFontSpacing, -pad]) {
                color("red") {
                    linear_extrude(fontExtrude+pad) {
                        text(username, font=fontFamily, size=fontSize, halign="left");
                    }
                }
            }
        }
    }
}

module rightText(year) {
    // This is shifted a bit compared to the original model, but I wanrted it to be even
    translate([baseWidth/2-10.9, -baseDepth/2, 0]) {
        rotate([baseAngle, 0, 0]) {
            translate([0, verticalFontSpacing, -pad]) {
                color("blue") {
            linear_extrude(fontExtrude+pad) {
                    text(year, font=fontFamily, size=fontSize, halign="right");
                }
            }
            }
        }
    }
}
