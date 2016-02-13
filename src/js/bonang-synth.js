(function () {
    "use strict";

    fluid.defaults("fluid.trackerSynth.bonang", {
        gradeNames: "flock.modelSynth",

        numNotes: 15,

        rootSpeed: 0.5,

        scales: {
            harrisonPelog: [1/1, 35/32, 5/4, 21/16, 49/32, 105/64, 7/4, 2/1]
        },

        pathets: {
            lima: [0, 1, 2, 4, 5],
            barang: [1, 2, 4, 5, 6]
        },

        model: {
            activeNote: -1,

            inputs: {
                player: {
                    trigger: {
                        source: 0.0
                    },

                    speed: 1.0
                }
            },

            speeds: {
                expander: {
                    funcName: "fluid.trackerSynth.bonang.noteSpeeds",
                    args: [
                        "{that}.options"
                    ]
                }
            }
        },

        synthDef: {
            id: "player",
            ugen: "flock.ugen.triggerBuffers",
            options: {
                bufferIDs: ["bonang"],
                interpolation: "cubic"
            },
            trigger: {
                ugen: "flock.ugen.valueChangeTrigger",
                source: 0
            }
        },

        components: {
            bufferLoader: {
                type: "fluid.trackerSynth.bonang.bufferLoader"
            }
        },

        modelListeners: {
            activeNote: [
                "fluid.trackerSynth.bonang.onNoteChange({change}.value, {that})"
            ]
        }
    });

    fluid.trackerSynth.bonang.noteSpeeds = function (options) {
        var scale = options.scales.harrisonPelog, // TODO: Hardcoded!
            pathet = options.pathets.lima, // TODO: Hardcoded!
            rootSpeed = options.rootSpeed,
            numOctaves = options.numNotes / pathet.length,
            noteSpeeds = [];

        for (var octave = 1; octave <= numOctaves; octave++) {
            for (var degree = 0; degree < pathet.length; degree++) {
                noteSpeeds.push(rootSpeed * scale[degree] * octave);
            }
        }

        return noteSpeeds;
    };

    fluid.trackerSynth.bonang.onNoteChange = function (activeNote, that) {
        // TODO: With a bit of thought, this can be entirely modelized, which is great!
        var changeSpec = {
            trigger: {
                source: activeNote + 1 // An "open" trigger is > 0.0.
            },

            speed: activeNote >= 0 ? that.model.speeds[activeNote] : 0.0
        };

        that.applier.change("inputs.player", changeSpec);
    };

    fluid.defaults("fluid.trackerSynth.bonang.bufferLoader", {
        gradeNames: "flock.bufferLoader",

        bufferDefs: [
            {
                id: "bonang",
                src: "audio/bonang-pelog-6.mp3"
            }
        ],

        listeners: {
            afterBuffersLoaded: [
                "{that}.enviro.play()"
            ]
        }
    });
}());
