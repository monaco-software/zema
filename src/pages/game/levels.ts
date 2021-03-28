import level1Thumb from './assets/images/thumbnails/level_1_thumb.webp';
import level2Thumb from './assets/images/thumbnails/level_2_thumb.webp';
import level3Thumb from './assets/images/thumbnails/level_3_thumb.webp';
import level1Background from './assets/images/backgrounds/level_1_back.webp';
import level2Background from './assets/images/backgrounds/level_2_back.webp';
import level3Background from './assets/images/backgrounds/level_3_back.webp';
import level4Background from './assets/images/backgrounds/level_4_back.webp';
import level5Background from './assets/images/backgrounds/level_5_back.webp';
import level6Background from './assets/images/backgrounds/level_6_back.webp';
import level7Background from './assets/images/backgrounds/level_7_back.webp';
import level8Background from './assets/images/backgrounds/level_8_back.webp';
import level9Background from './assets/images/backgrounds/level_9_back.webp';
import { Level } from './types';
import { BALL_COLORS } from './constants';
import { getText } from '@common/langUtils';

const levels: Level[] = [{
  title: getText('game_level_title_1'),
  speed: 20, // fps и количество тиков pusher в секунду
  balls: 120,
  ballColors: [
    BALL_COLORS.RED,
    BALL_COLORS.GREEN,
    BALL_COLORS.BLUE,
  ],
  frogPosition: { x: 303, y: 310 },
  skullPosition: { x: 567, y: 362 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 65, // как далеко выкатывать в начале уровня
  start: [365, -36], // начало кривой Безье
  curve: [ // контрольные точки
    [416, -7, 514, 50, 564, 84],
    [590, 102, 671, 169, 703, 211],
    [725, 240, 754, 287, 755, 337],
    [756, 376, 742, 424, 725, 447],
    [708, 470, 666, 504, 628, 517],
    [580, 534, 516, 551, 442, 551],
    [368, 551, 304, 546, 251, 526],
    [181, 500, 133, 473, 95, 433],
    [69, 407, 50, 373, 47, 327],
    [44, 284, 54, 242, 75, 207],
    [99, 168, 142, 114, 208, 99],
    [272, 84, 353, 99, 414, 122],
    [481, 147, 522, 170, 557, 195],
    [592, 221, 613, 239, 637, 271],
    [654, 293, 674, 322, 670, 366],
    [667, 400, 648, 433, 596, 457],
    [551, 478, 476, 492, 407, 488],
    [338, 484, 284, 467, 235, 445],
    [181, 420, 140, 394, 123, 364],
    [96, 316, 106, 273, 123, 244],
    [146, 203, 185, 178, 240, 168],
    [308, 155, 369, 174, 410, 191],
    [459, 212, 498, 231, 519, 250],
    [541, 269, 554, 284, 562, 310],
  ],
  background: level1Background,
  thumbnail: level1Thumb,
}, {
  title: getText('game_level_title_2'),
  speed: 22,
  balls: 120,
  ballColors: [
    BALL_COLORS.GREEN,
    BALL_COLORS.BLUE,
    BALL_COLORS.YELLOW,
  ],
  frogPosition: { x: 419, y: 292 },
  skullPosition: { x: 158, y: 305 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 70,
  start: [-38, 191],
  curve: [
    [-19, 179, 12, 154, 46, 139],
    [88, 120, 135, 101, 174, 90],
    [213, 79, 313, 53, 435, 48],
    [481, 46, 548, 58, 586, 76],
    [627, 95, 668, 118, 705, 165],
    [723, 187, 753, 235, 755, 270],
    [757, 312, 746, 326, 725, 337],
    [710, 345, 686, 348, 672, 333],
    [647, 307, 637, 282, 620, 247],
    [604, 214, 583, 180, 552, 157],
    [523, 137, 492, 120, 444, 120],
    [382, 120, 318, 133, 255, 151],
    [207, 164, 137, 192, 92, 231],
    [56, 262, 39, 303, 36, 334],
    [33, 366, 40, 421, 61, 459],
    [96, 519, 144, 532, 159, 536],
    [219, 552, 431, 560, 545, 530],
    [590, 518, 671, 494, 699, 457],
    [713, 437, 710, 416, 698, 403],
    [684, 388, 668, 378, 644, 375],
    [618, 371, 596, 380, 567, 401],
    [533, 426, 470, 469, 436, 476],
    [377, 489, 338, 484, 291, 474],
    [244, 464, 211, 450, 188, 427],
    [163, 402, 156, 389, 155, 357],
  ],
  background: level2Background,
  thumbnail: level2Thumb,
}, {
  title: getText('game_level_title_3'),
  speed: 24,
  balls: 120,
  ballColors: [
    BALL_COLORS.RED,
    BALL_COLORS.GREEN,
    BALL_COLORS.YELLOW,
    BALL_COLORS.PINK,
  ],
  frogPosition: { x: 341, y: 325 },
  skullPosition: { x: 455, y: 214 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 65,
  start: [732, 631],
  curve: [
    [743, 406, 739, 242, 694, 145],
    [675, 104, 635, 59, 569, 50],
    [459, 35, 344, 83, 254, 139],
    [159, 198, 94, 272, 66, 322],
    [35, 377, 41, 401, 46, 420],
    [51, 439, 84, 482, 114, 496],
    [163, 519, 230, 542, 302, 543],
    [406, 545, 537, 538, 587, 500],
    [643, 457, 655, 420, 660, 389],
    [667, 348, 664, 277, 656, 236],
    [648, 197, 633, 162, 621, 143],
    [610, 127, 598, 134, 592, 146],
    [588, 158, 580, 192, 575, 211],
    [563, 253, 521, 384, 501, 408],
    [450, 470, 386, 486, 317, 474],
    [271, 466, 215, 456, 185, 430],
    [168, 415, 143, 395, 155, 344],
    [168, 288, 272, 219, 309, 191],
    [344, 165, 390, 133, 425, 119],
    [445, 111, 469, 105, 479, 115],
    [487, 124, 482, 149, 473, 173],
  ],
  background: level3Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_4'),
  speed: 26,
  balls: 120,
  ballColors: [
    BALL_COLORS.BLUE,
    BALL_COLORS.GREEN,
    BALL_COLORS.YELLOW,
    BALL_COLORS.GREY,
  ],
  frogPosition: { x: 410, y: 290 },
  skullPosition: { x: 266, y: 266 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 70,
  start: [654, -32],
  curve: [
    [655, 204, 669, 338, 615, 429],
    [574, 499, 495, 554, 401, 556],
    [263, 559, 194, 489, 159, 408],
    [128, 334, 125, 253, 177, 167],
    [209, 114, 293, 65, 363, 66],
    [443, 67, 490, 92, 542, 148],
    [569, 177, 599, 241, 590, 310],
    [582, 373, 552, 423, 516, 453],
    [490, 474, 428, 509, 350, 491],
    [254, 469, 221, 410, 206, 354],
    [191, 301, 195, 246, 234, 200],
    [271, 157, 309, 130, 377, 131],
    [434, 132, 476, 163, 499, 193],
    [518, 218, 532, 260, 529, 300],
    [521, 376, 477, 410, 428, 428],
    [361, 453, 293, 405, 279, 375],
    [263, 340, 265, 327, 264, 317],
  ],
  background: level4Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_5'),
  speed: 28,
  balls: 130,
  ballColors: [
    BALL_COLORS.BLUE,
    BALL_COLORS.RED,
    BALL_COLORS.YELLOW,
    BALL_COLORS.PINK,
  ],
  frogPosition: { x: 462, y: 279 },
  skullPosition: { x: 292, y: 184 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 70,
  start: [828, 513],
  curve: [
    [736, 508, 688, 504, 657, 519],
    [607, 543, 592, 562, 489, 572],
    [430, 578, 292, 563, 224, 526],
    [151, 486, 97, 436, 71, 373],
    [53, 328, 46, 246, 47, 204],
    [49, 164, 50, 122, 63, 100],
    [70, 88, 77, 77, 100, 74],
    [119, 71, 136, 86, 143, 103],
    [153, 129, 123, 212, 128, 271],
    [131, 306, 144, 357, 174, 396],
    [202, 432, 250, 472, 290, 489],
    [333, 507, 447, 523, 511, 509],
    [565, 498, 619, 474, 655, 432],
    [691, 390, 718, 330, 725, 291],
    [732, 253, 730, 161, 643, 96],
    [560, 34, 427, 30, 351, 57],
    [278, 82, 209, 152, 201, 201],
    [187, 285, 196, 335, 233, 380],
    [273, 429, 333, 457, 404, 462],
    [465, 467, 532, 452, 591, 412],
    [616, 395, 654, 352, 666, 270],
    [675, 210, 618, 151, 583, 135],
    [517, 104, 464, 104, 404, 113],
    [374, 117, 346, 129, 321, 149],
  ],
  background: level5Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_6'),
  speed: 30,
  balls: 140,
  ballColors: [
    BALL_COLORS.BLUE,
    BALL_COLORS.GREEN,
    BALL_COLORS.PINK,
    BALL_COLORS.GREY,
  ],
  frogPosition: { x: 239, y: 286 },
  skullPosition: { x: 74, y: 409 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 70,
  start: [-31, 64],
  curve: [
    [125, 48, 345, 40, 459, 59],
    [575, 78, 654, 109, 703, 160],
    [743, 202, 759, 244, 761, 304],
    [763, 379, 730, 413, 682, 455],
    [648, 484, 533, 536, 441, 550],
    [337, 566, 247, 576, 153, 551],
    [131, 545, 109, 524, 107, 509],
    [104, 487, 119, 484, 132, 485],
    [185, 490, 224, 507, 278, 506],
    [337, 504, 433, 493, 468, 483],
    [511, 470, 618, 447, 654, 362],
    [673, 318, 664, 222, 592, 182],
    [480, 119, 226, 91, 153, 92],
    [80, 93, 71, 101, 65, 109],
    [60, 117, 64, 127, 70, 132],
    [90, 149, 152, 158, 236, 168],
    [324, 179, 455, 192, 542, 239],
    [586, 263, 596, 322, 549, 355],
    [479, 405, 307, 409, 234, 410],
    [164, 411, 139, 412, 125, 410],
  ],
  background: level6Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_7'),
  speed: 30,
  balls: 150,
  ballColors: [
    BALL_COLORS.BLUE,
    BALL_COLORS.GREEN,
    BALL_COLORS.PINK,
    BALL_COLORS.YELLOW,
    BALL_COLORS.RED,
  ],
  frogPosition: { x: 382, y: 425 },
  skullPosition: { x: 373, y: 207 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 70,
  start: [560, -34],
  curve: [
    [590, 15, 686, 161, 719, 244],
    [757, 341, 774, 416, 759, 511],
    [755, 536, 744, 555, 720, 557],
    [702, 558, 676, 543, 660, 512],
    [626, 448, 604, 335, 590, 281],
    [567, 195, 536, 138, 489, 101],
    [439, 63, 391, 55, 339, 60],
    [288, 65, 241, 83, 209, 119],
    [157, 177, 115, 263, 96, 303],
    [77, 343, 45, 401, 41, 477],
    [39, 516, 51, 532, 73, 537],
    [88, 540, 109, 540, 122, 522],
    [140, 498, 167, 325, 177, 294],
    [202, 215, 234, 171, 262, 155],
    [298, 134, 333, 123, 384, 125],
    [420, 126, 464, 149, 485, 181],
    [511, 221, 532, 259, 544, 313],
    [554, 356, 564, 409, 542, 457],
    [516, 515, 472, 557, 386, 557],
    [331, 557, 280, 531, 240, 478],
    [205, 432, 210, 377, 215, 345],
    [222, 302, 236, 264, 279, 232],
    [289, 224, 314, 212, 326, 212],
  ],
  background: level7Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_8'),
  speed: 30,
  balls: 160,
  ballColors: [
    BALL_COLORS.GREY,
    BALL_COLORS.GREEN,
    BALL_COLORS.PINK,
    BALL_COLORS.YELLOW,
    BALL_COLORS.RED,
  ],
  frogPosition: { x: 463, y: 345 },
  skullPosition: { x: 228, y: 407 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 65,
  start: [105, -31],
  curve: [
    [96, 53, 49, 468, 47, 499],
    [45, 528, 51, 540, 57, 546],
    [66, 556, 79, 564, 109, 565],
    [122, 565, 689, 555, 701, 555],
    [713, 555, 735, 546, 745, 538],
    [762, 525, 771, 497, 752, 456],
    [745, 440, 573, 115, 557, 95],
    [535, 66, 520, 55, 497, 53],
    [459, 49, 439, 62, 403, 87],
    [383, 100, 120, 391, 109, 406],
    [98, 421, 96, 438, 103, 456],
    [110, 474, 124, 491, 147, 493],
    [170, 495, 616, 494, 637, 493],
    [649, 493, 667, 493, 674, 476],
    [681, 460, 674, 432, 665, 415],
    [656, 398, 541, 191, 527, 170],
    [504, 136, 495, 136, 483, 135],
    [471, 134, 454, 142, 436, 159],
    [423, 172, 262, 352, 251, 365],
  ],
  background: level8Background,
  thumbnail: level3Thumb,
}, {
  title: getText('game_level_title_9'),
  speed: 30,
  balls: 170,
  ballColors: [
    BALL_COLORS.BLUE,
    BALL_COLORS.YELLOW,
    BALL_COLORS.RED,
    BALL_COLORS.GREEN,
    BALL_COLORS.PINK,
    BALL_COLORS.GREY,
  ],
  frogPosition: { x: 390, y: 355 },
  skullPosition: { x: 658, y: 290 },
  scorePosition: { x: 90, y: 50 },
  rollOut: 55,
  start: [-39, 77],
  curve: [
    [8, 78, 685, 80, 697, 80],
    [722, 80, 736, 88, 735, 115],
    [735, 144, 722, 153, 704, 153],
    [698, 153, 109, 145, 109, 145],
    [87, 146, 81, 157, 81, 176],
    [81, 180, 80, 525, 80, 531],
    [80, 549, 92, 560, 110, 561],
    [113, 561, 670, 563, 707, 563],
    [727, 563, 733, 548, 732, 530],
    [732, 524, 734, 240, 734, 235],
    [734, 214, 717, 208, 699, 208],
    [693, 208, 191, 209, 178, 210],
    [162, 211, 155, 221, 155, 234],
    [155, 247, 153, 463, 153, 472],
    [153, 496, 162, 505, 180, 505],
    [184, 505, 625, 504, 625, 504],
    [645, 503, 657, 497, 657, 475],
    [657, 471, 658, 342, 658, 333],
  ],
  background: level9Background,
  thumbnail: level3Thumb,
}];

export default Object.freeze(levels);
