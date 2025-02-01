<script>
	import { goto } from '$app/navigation';
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Search } from "lucide-svelte";
	let searchQuery = $state("");

	const duas = [
		{
			"name": "Upon Waking Up",
			"index": 0
		},
		{
			"name": "Upon Waking Up (2)",
			"index": 1
		},
		{
			"name": "Upon Waking Up (3)",
			"index": 2
		},
		{
			"name": "Seeking Forgiveness Upon Waking Up",
			"index": 3
		},
		{
			"name": "Upon Wearing Clothes",
			"index": 4
		},
		{
			"name": "Upon Wearing New Clothes",
			"index": 5
		},
		{
			"name": "Upon Wearing New Clothes (Alternative 1)",
			"index": 6
		},
		{
			"name": "Upon Wearing New Clothes (Alternative 2)",
			"index": 7
		},
		{
			"name": "Upon Removing Clothes",
			"index": 8
		},
		{
			"name": "Upon Entering the Restroom",
			"index": 9
		},
		{
			"name": "Upon Exiting the Restroom",
			"index": 10
		},
		{
			"name": "Before Ablution",
			"index": 11
		},
		{
			"name": "After Ablution (1)",
			"index": 12
		},
		{
			"name": "After Ablution (2)",
			"index": 13
		},
		{
			"name": "After Ablution (3)",
			"index": 14
		},
		{
			"name": "Upon Leaving the House (1)",
			"index": 15
		},
		{
			"name": "Upon Leaving the House (2)",
			"index": 16
		},
		{
			"name": "Upon Entering the House",
			"index": 17
		},
		{
			"name": "Going to the Mosque (1)",
			"index": 18
		},
		{
			"name": "Going to the Mosque (2)",
			"index": 19
		},
		{
			"name": "Going to the Mosque (3)",
			"index": 20
		},
		{
			"name": "Going to the Mosque (4)",
			"index": 21
		},
		{
			"name": "Entering the Mosque (1)",
			"index": 22
		},
		{
			"name": "Entering the Mosque (2)",
			"index": 23
		},
		{
			"name": "Exiting the Mosque",
			"index": 24
		},
		{
			"name": "During the Call to Prayer (1)",
			"index": 25
		},
		{
			"name": "During the Call to Prayer (2)",
			"index": 26
		},
		{
			"name": "During the Call to Prayer (3)",
			"index": 27
		},
		{
			"name": "During the Call to Prayer (4)",
			"index": 28
		},
		{
			"name": "During the Call to Prayer (5)",
			"index": 29
		},
		{
			"name": "Opening Supplication of Prayer (1)",
			"index": 30
		},
		{
			"name": "Opening Supplication of Prayer (2)",
			"index": 31
		},
		{
			"name": "Opening Supplication of Prayer (3)",
			"index": 32
		},
		{
			"name": "Opening Supplication of Prayer (4)",
			"index": 33
		},
		{
			"name": "Opening Supplication of Prayer (5)",
			"index": 34
		},
		{
			"name": "Opening Supplication of Prayer (6)",
			"index": 35
		},
		{
			"name": "During Bowing (1)",
			"index": 36
		},
		{
			"name": "During Bowing (2)",
			"index": 37
		},
		{
			"name": "During Bowing (3)",
			"index": 38
		},
		{
			"name": "During Bowing (4)",
			"index": 39
		},
		{
			"name": "During Bowing (5)",
			"index": 40
		},
		{
			"name": "Rising from Bowing (1)",
			"index": 41
		},
		{
			"name": "Rising from Bowing (2)",
			"index": 42
		},
		{
			"name": "Rising from Bowing (3)",
			"index": 43
		},
		{
			"name": "During Prostration (1)",
			"index": 44
		},
		{
			"name": "During Prostration (2)",
			"index": 45
		},
		{
			"name": "During Prostration (3)",
			"index": 46
		},
		{
			"name": "During Prostration (4)",
			"index": 47
		},
		{
			"name": "During Prostration (5)",
			"index": 48
		},
		{
			"name": "During Prostration (6)",
			"index": 49
		},
		{
			"name": "During Prostration (7)",
			"index": 50
		},
		{
			"name": "Between the Two Prostrations (1)",
			"index": 51
		},
		{
			"name": "Between the Two Prostrations (2)",
			"index": 52
		},
		{
			"name": "Prostration of Recitation",
			"index": 53
		},
		{
			"name": "Prostration of Recitation (2)",
			"index": 54
		},
		{
			"name": "Testimony of Faith (Tashahhud)",
			"index": 55
		},
		{
			"name": "Blessings upon the Prophet (1)",
			"index": 56
		},
		{
			"name": "Blessings upon the Prophet (2)",
			"index": 57
		},
		{
			"name": "After Tashahhud (1)",
			"index": 58
		},
		{
			"name": "After Tashahhud (2)",
			"index": 59
		},
		{
			"name": "After Tashahhud (3)",
			"index": 60
		},
		{
			"name": "After Tashahhud (4)",
			"index": 61
		},
		{
			"name": "After Tashahhud (5)",
			"index": 62
		},
		{
			"name": "After Tashahhud (6)",
			"index": 63
		},
		{
			"name": "After Tashahhud (7)",
			"index": 64
		},
		{
			"name": "After Tashahhud (8)",
			"index": 65
		},
		{
			"name": "After Tashahhud (9)",
			"index": 66
		},
		{
			"name": "After Tashahhud (10)",
			"index": 67
		},
		{
			"name": "After Tashahhud (11)",
			"index": 68
		},
		{
			"name": "After Prayer (1)",
			"index": 69
		},
		{
			"name": "After Prayer (2)",
			"index": 70
		},
		{
			"name": "After Prayer (3)",
			"index": 71
		},
		{
			"name": "After Prayer (4)",
			"index": 72
		},
		{
			"name": "After Prayer (5)",
			"index": 73
		},
		{
			"name": "After Prayer (6)",
			"index": 74
		},
		{
			"name": "After Prayer (7)",
			"index": 75
		},
		{
			"name": "After Fajr Prayer",
			"index": 76
		},
		{
			"name": "Istikhara (2)",
			"index": 77
		},
		{
			"name": "Morning and Evening Remembrances (1)",
			"index": 78
		},
		{
			"name": "Morning and Evening Remembrances (2)",
			"index": 79
		},
		{
			"name": "Morning and Evening Remembrances (3)",
			"index": 80
		},
		{
			"name": "Morning and Evening Remembrances (4)",
			"index": 81
		},
		{
			"name": "Morning and Evening Remembrances (5)",
			"index": 82
		},
		{
			"name": "Morning and Evening Remembrances (6)",
			"index": 83
		},
		{
			"name": "Morning and Evening Remembrances (7)",
			"index": 84
		},
		{
			"name": "Morning and Evening Remembrances (8)",
			"index": 85
		},
		{
			"name": "Morning and Evening Remembrances (9)",
			"index": 86
		},
		{
			"name": "Morning and Evening Remembrances (10)",
			"index": 87
		},
		{
			"name": "Morning and Evening Remembrances (11)",
			"index": 88
		},
		{
			"name": "Morning and Evening Remembrances (12)",
			"index": 89
		},
		{
			"name": "Morning and Evening Remembrances (13)",
			"index": 90
		},
		{
			"name": "Morning and Evening Remembrances (14)",
			"index": 91
		},
		{
			"name": "Morning and Evening Remembrances (15)",
			"index": 92
		},
		{
			"name": "Morning and Evening Remembrances (16)",
			"index": 93
		},
		{
			"name": "Morning and Evening Remembrances (17)",
			"index": 94
		},
		{
			"name": "Morning and Evening Remembrances (18)",
			"index": 95
		},
		{
			"name": "Morning and Evening Remembrances (19)",
			"index": 96
		},
		{
			"name": "Morning and Evening Remembrances (20)",
			"index": 97
		},
		{
			"name": "Morning and Evening Remembrances (21)",
			"index": 98
		},
		{
			"name": "Morning and Evening Remembrances (22)",
			"index": 99
		},
		{
			"name": "Morning and Evening Remembrances (23)",
			"index": 100
		},
		{
			"name": "Morning and Evening Remembrances (24)",
			"index": 101
		},
		{
			"name": "Morning and Evening Remembrances (25)",
			"index": 102
		},
		{
			"name": "Before Sleeping (2)",
			"index": 103
		},
		{
			"name": "Before Sleeping (3)",
			"index": 104
		},
		{
			"name": "Before Sleeping (4)",
			"index": 105
		},
		{
			"name": "Before Sleeping (5)",
			"index": 106
		},
		{
			"name": "Before Sleeping (6)",
			"index": 107
		},
		{
			"name": "Before Sleeping (7)",
			"index": 108
		},
		{
			"name": "Before Sleeping (8)",
			"index": 109
		},
		{
			"name": "Before Sleeping (9)",
			"index": 110
		},
		{
			"name": "Before Sleeping (10)",
			"index": 111
		},
		{
			"name": "Before Sleeping (11)",
			"index": 112
		},
		{
			"name": "Before Sleeping (12)",
			"index": 113
		},
		{
			"name": "Before Sleeping (13)",
			"index": 114
		},
		{
			"name": "Turning Over in Bed",
			"index": 115
		},
		{
			"name": "Anxiety/Fear in Sleep",
			"index": 116
		},
		{
			"name": "Bad Dreams (1)",
			"index": 117
		},
		{
			"name": "Bad Dreams (2)",
			"index": 118
		},
		{
			"name": "Bad Dreams (3)",
			"index": 119
		},
		{
			"name": "Bad Dreams (4)",
			"index": 120
		},
		{
			"name": "Bad Dreams (5)",
			"index": 121
		},
		{
			"name": "Qunut in Witr",
			"index": 122
		},
		{
			"name": "Qunut in Witr (2)",
			"index": 123
		},
		{
			"name": "Qunut in Witr (3)",
			"index": 124
		},
		{
			"name": "After Witr Prayer",
			"index": 125
		},
		{
			"name": "Distress and Sorrow",
			"index": 126
		},
		{
			"name": "Distress and Sorrow (2)",
			"index": 127
		},
		{
			"name": "Hardship (1)",
			"index": 128
		},
		{
			"name": "Hardship (2)",
			"index": 129
		},
		{
			"name": "Hardship (3)",
			"index": 130
		},
		{
			"name": "Hardship (4)",
			"index": 131
		},
		{
			"name": "Meeting an Enemy/Authority (1)",
			"index": 132
		},
		{
			"name": "Meeting an Enemy/Authority (2)",
			"index": 133
		},
		{
			"name": "Meeting an Enemy/Authority (3)",
			"index": 134
		},
		{
			"name": "Fear of Oppression (1)",
			"index": 135
		},
		{
			"name": "Fear of Oppression (2)",
			"index": 136
		},
		{
			"name": "Against an Enemy",
			"index": 137
		},
		{
			"name": "Fearing a Group",
			"index": 138
		},
		{
			"name": "Doubts in Faith (1)",
			"index": 139
		},
		{
			"name": "Doubts in Faith (2)",
			"index": 140
		},
		{
			"name": "Doubts in Faith (3)",
			"index": 141
		},
		{
			"name": "Doubts in Faith (4)",
			"index": 142
		},
		{
			"name": "Repaying Debt (1)",
			"index": 143
		},
		{
			"name": "Repaying Debt (2)",
			"index": 144
		},
		{
			"name": "Whispers in Prayer/Recitation",
			"index": 145
		},
		{
			"name": "Difficulty in a Matter",
			"index": 146
		},
		{
			"name": "After Committing a Sin",
			"index": 147
		},
		{
			"name": "Repelling Satan (1)",
			"index": 148
		},
		{
			"name": "Repelling Satan (2)",
			"index": 149
		},
		{
			"name": "Repelling Satan (3)",
			"index": 150
		},
		{
			"name": "Overwhelmed by Undesirable Situation (1)",
			"index": 151
		},
		{
			"name": "Overwhelmed by Undesirable Situation (2)",
			"index": 152
		},
		{
			"name": "Congratulating on a Newborn",
			"index": 153
		},
		{
			"name": "Protection for Children",
			"index": 154
		},
		{
			"name": "Visiting the Sick (1)",
			"index": 155
		},
		{
			"name": "Visiting the Sick (2)",
			"index": 156
		},
		{
			"name": "Virtue of Visiting the Sick",
			"index": 157
		},
		{
			"name": "Sick Who Have Lost Hope (1)",
			"index": 158
		},
		{
			"name": "Sick Who Have Lost Hope (2)",
			"index": 159
		},
		{
			"name": "Sick Who Have Lost Hope (3)",
			"index": 160
		},
		{
			"name": "Guidance for the Dying",
			"index": 161
		},
		{
			"name": "Afflicted by Calamity",
			"index": 162
		},
		{
			"name": "Closing Eyes of Deceased",
			"index": 163
		},
		{
			"name": "Funeral Prayer (1)",
			"index": 164
		},
		{
			"name": "Funeral Prayer (2)",
			"index": 165
		},
		{
			"name": "Funeral Prayer (3)",
			"index": 166
		},
		{
			"name": "Funeral Prayer (4)",
			"index": 167
		},
		{
			"name": "Oversight in Funeral Prayer (1)",
			"index": 168
		},
		{
			"name": "Oversight in Funeral Prayer (2)",
			"index": 169
		},
		{
			"name": "Oversight in Funeral Prayer (3)",
			"index": 170
		},
		{
			"name": "Condolence (1)",
			"index": 171
		},
		{
			"name": "Condolence (2)",
			"index": 172
		},
		{
			"name": "Placing Deceased in Grave",
			"index": 173
		},
		{
			"name": "After Burying Deceased",
			"index": 174
		},
		{
			"name": "Visiting Graves",
			"index": 175
		},
		{
			"name": "Strong Wind (1)",
			"index": 176
		},
		{
			"name": "Strong Wind (2)",
			"index": 177
		},
		{
			"name": "Thunder",
			"index": 178
		},
		{
			"name": "Rain (1)",
			"index": 179
		},
		{
			"name": "Rain (2)",
			"index": 180
		},
		{
			"name": "Rain (3)",
			"index": 181
		},
		{
			"name": "When Rain Falls",
			"index": 182
		},
		{
			"name": "After Rainfall",
			"index": 183
		},
		{
			"name": "Relief from Thirst",
			"index": 184
		},
		{
			"name": "Sighting the New Moon",
			"index": 185
		},
		{
			"name": "Breaking the Fast (1)",
			"index": 186
		},
		{
			"name": "Breaking the Fast (2)",
			"index": 187
		},
		{
			"name": "Before Eating (1)",
			"index": 188
		},
		{
			"name": "Before Eating (2)",
			"index": 189
		},
		{
			"name": "After Eating (1)",
			"index": 190
		},
		{
			"name": "After Eating (2)",
			"index": 191
		},
		{
			"name": "Guest for the Host",
			"index": 192
		},
		{
			"name": "Someone Who Gives You Drink",
			"index": 193
		},
		{
			"name": "Breaking Fast at Someone's Home",
			"index": 194
		},
		{
			"name": "Fasting Person Cannot Eat",
			"index": 195
		},
		{
			"name": "Fasting Person Insulted",
			"index": 196
		},
		{
			"name": "Seeing First Fruits",
			"index": 197
		},
		{
			"name": "Sneezing",
			"index": 198
		},
		{
			"name": "Disbeliever Sneezes",
			"index": 199
		},
		{
			"name": "Newlywed Couple",
			"index": 200
		},
		{
			"name": "Married Person/Buying Animal",
			"index": 201
		},
		{
			"name": "Before Intimacy with Spouse",
			"index": 202
		},
		{
			"name": "Anger",
			"index": 203
		},
		{
			"name": "Seeing Someone Afflicted",
			"index": 204
		},
		{
			"name": "In a Gathering",
			"index": 205
		},
		{
			"name": "Expiation for a Gathering",
			"index": 206
		},
		{
			"name": "Response to 'May Allah Forgive You'",
			"index": 207
		},
		{
			"name": "Someone Who Has Done You a Favor",
			"index": 208
		},
		{
			"name": "Protection from the Dajjal",
			"index": 209
		},
		{
			"name": "Response to 'I Love You for Allah'",
			"index": 210
		},
		{
			"name": "Someone Offers You Their Wealth",
			"index": 211
		},
		{
			"name": "Repaying a Loan",
			"index": 212
		},
		{
			"name": "Fear of Shirk",
			"index": 213
		},
		{
			"name": "Response to 'May Allah Bless You",
			"index": 214
		},
		{
			"name": "Against Superstition",
			"index": 215
		},
		{
			"name": "Riding an Animal",
			"index": 216
		},
		{
			"name": "Travel",
			"index": 217
		},
		{
			"name": "Entering a Town/City",
			"index": 218
		},
		{
			"name": "Entering the Marketplace",
			"index": 219
		},
		{
			"name": "Mount Has Difficulty",
			"index": 220
		},
		{
			"name": "Traveler for the Resident",
			"index": 221
		},
		{
			"name": "Resident for the Traveler (1)",
			"index": 222
		},
		{
			"name": "Resident for the Traveler (2)",
			"index": 223
		},
		{
			"name": "Travel: Greatness/Glorification",
			"index": 224
		},
		{
			"name": "Traveler at Dawn",
			"index": 225
		},
		{
			"name": "Arriving at a Destination",
			"index": 226
		},
		{
			"name": "Returning from Travel",
			"index": 227
		},
		{
			"name": "Pleasant/Unpleasant Matters",
			"index": 228
		},
		{
			"name": "Virtue of Blessings on Prophet (1)",
			"index": 229
		},
		{
			"name": "Virtue of Blessings on Prophet (2)",
			"index": 230
		},
		{
			"name": "Virtue of Blessings on Prophet (3)",
			"index": 231
		},
		{
			"name": "Virtue of Blessings on Prophet (4)",
			"index": 232
		},
		{
			"name": "Virtue of Blessings on Prophet (5)",
			"index": 233
		},
		{
			"name": "Spreading Peace (1)",
			"index": 234
		},
		{
			"name": "Spreading Peace (2)",
			"index": 235
		},
		{
			"name": "Spreading Peace (3)",
			"index": 236
		},
		{
			"name": "Responding to Disbelievers",
			"index": 237
		},
		{
			"name": "Rooster/Donkey",
			"index": 238
		},
		{
			"name": "Dogs Barking at Night",
			"index": 239
		},
		{
			"name": "Someone Who Has Wronged You",
			"index": 240
		},
		{
			"name": "When Praised",
			"index": 241
		},
		{
			"name": "When Purified (Spiritually)",
			"index": 242
		},
		{
			"name": "Talbiyah",
			"index": 243
		},
		{
			"name": "Reaching the Black Stone",
			"index": 244
		},
		{
			"name": "Between Yemeni Corner and Black Stone",
			"index": 245
		},
		{
			"name": "Sa'y between Safa and Marwa",
			"index": 246
		},
		{
			"name": "Day of Arafah",
			"index": 247
		},
		{
			"name": "Mash'ar al-Haram",
			"index": 248
		},
		{
			"name": "Throwing Stones at Pillars",
			"index": 249
		},
		{
			"name": "Amazement/Joy (1)",
			"index": 250
		},
		{
			"name": "Amazement/Joy (2)",
			"index": 251
		},
		{
			"name": "Pleasant Happens",
			"index": 252
		},
		{
			"name": "Physical Pain",
			"index": 253
		},
		{
			"name": "Fearing Specific Harm",
			"index": 254
		},
		{
			"name": "Startled",
			"index": 255
		},
		{
			"name": "Slaughtering an Animal",
			"index": 256
		},
		{
			"name": "Ward Off Evil of Devils",
			"index": 257
		},
		{
			"name": "Forgiveness/Repentance (1)",
			"index": 258
		},
		{
			"name": "Forgiveness/Repentance (2)",
			"index": 259
		},
		{
			"name": "Forgiveness/Repentance (3)",
			"index": 260
		},
		{
			"name": "Forgiveness/Repentance (4)",
			"index": 261
		},
		{
			"name": "Forgiveness/Repentance (5)",
			"index": 262
		},
		{
			"name": "Forgiveness/Repentance (6)",
			"index": 263
		},
		{
			"name": "Glorifying/Praising (1)",
			"index": 264
		},
		{
			"name": "Glorifying/Praising (2)",
			"index": 265
		},
		{
			"name": "Glorifying/Praising (3)",
			"index": 266
		},
		{
			"name": "Glorifying/Praising (4)",
			"index": 267
		},
		{
			"name": "Glorifying/Praising (5)",
			"index": 268
		},
		{
			"name": "Glorifying/Praising (6)",
			"index": 269
		},
		{
			"name": "Glorifying/Praising (7)",
			"index": 270
		},
		{
			"name": "Glorifying/Praising (8)",
			"index": 271
		},
		{
			"name": "Glorifying/Praising (9)",
			"index": 272
		},
		{
			"name": "Glorifying/Praising (10)",
			"index": 273
		},
		{
			"name": "Glorifying/Praising (11)",
			"index": 274
		},
		{
			"name": "Glorifying/Praising (12)",
			"index": 275
		},
		{
			"name": "How Prophet Glorified Allah",
			"index": 276
		},
		{
			"name": "Various Good Deeds/Etiquettes",
			"index": 277
		},
		{
			"name": "Supplication Before Sleeping",
			"index": 278
		},
		{
			"name": "Supplication Upon Waking Up",
			"index": 279
		},
		{
			"name": "Supplication Entering the Bathroom",
			"index": 280
		},
		{
			"name": "Supplication Leaving the Bathroom",
			"index": 281
		},
		{
			"name": "Supplication Before Eating",
			"index": 282
		},
		{
			"name": "Supplication If Forgetting Bismillah at the Beginning of a Meal",
			"index": 283
		},
		{
			"name": "Supplication After Eating",
			"index": 284
		},
		{
			"name": "Supplication Entering the Mosque",
			"index": 285
		},
		{
			"name": "Supplication Leaving the Mosque",
			"index": 286
		},
		{
			"name": "Supplication Before Performing Ablution",
			"index": 287
		},
		{
			"name": "Supplication After Performing Ablution",
			"index": 288
		},
		{
			"name": "Supplication for Breaking the Fast",
			"index": 289
		},
		{
			"name": "Supplication Entering the House #1",
			"index": 290
		},
		{
			"name": "Supplication Entering the House #2",
			"index": 291
		},
		{
			"name": "Supplication Leaving the House",
			"index": 292
		},
		{
			"name": "Supplication for Protection from Causing or Experiencing Harm Outside the House",
			"index": 293
		},
		{
			"name": "Travel Supplication",
			"index": 294
		},
		{
			"name": "Supplication of a Resident for Someone Who is Traveling",
			"index": 295
		},
		{
			"name": "Supplication for Piety from a Resident to Someone Who is Traveling",
			"index": 296
		},
		{
			"name": "Supplication When Wearing New Clothes",
			"index": 297
		},
		{
			"name": "Supplication When Wearing Clothes",
			"index": 298
		},
		{
			"name": "Supplication When Mounting a Vehicle",
			"index": 299
		},
		{
			"name": "Supplication When it Rains",
			"index": 300
		},
		{
			"name": "Supplication During Heavy Rain",
			"index": 301
		},
		{
			"name": "Supplication After it Rains",
			"index": 302
		},
		{
			"name": "Supplication During Strong Wind",
			"index": 303
		},
		{
			"name": "The Best Supplication for Seeking Forgiveness (Sayyid al-Istighfar)",
			"index": 304
		},
		{
			"name": "Supplication for Ease in All Matters",
			"index": 305
		},
		{
			"name": "Supplication When Afflicted by Calamity",
			"index": 306
		},
		{
			"name": "Supplication When in Debt",
			"index": 307
		},
		{
			"name": "Supplication for Protection from Laziness, Sadness, and Debt",
			"index": 308
		},
		{
			"name": "Supplication After Sneezing",
			"index": 309
		},
		{
			"name": "Supplication Upon Hearing Someone Sneeze",
			"index": 310
		},
		{
			"name": "Response to Someone Who Says 'Yarhamukallah' After You Sneeze",
			"index": 311
		},
		{
			"name": "Supplication for Good Character",
			"index": 312
		},
		{
			"name": "Prayer for Protection from Satan",
			"index": 313
		},
		{
			"name": "Prayer After the Adhan",
			"index": 314
		},
		{
			"name": "Prayer for Forgiveness for Parents",
			"index": 315
		},
		{
			"name": "Istighfar",
			"index": 316
		},
		{
			"name": "Allah, The Giver of Peace",
			"index": 317
		},
		{
			"name": "Allah, The Preventer and The Giver of All Things",
			"index": 318
		},
		{
			"name": "Allah, The Possessor of All and The Only One Worthy of Worship",
			"index": 319
		},
		{
			"name": "Tasbih",
			"index": 320
		},
		{
			"name": "Tahmid",
			"index": 321
		},
		{
			"name": "Takbir",
			"index": 322
		},
		{
			"name": "There is No Partner for Allah, and To Him Belongs All Things",
			"index": 323
		},
		{
			"name": "Ayat al-Kursi",
			"index": 324
		},
		{
			"name": "Al-Ikhlas",
			"index": 325
		},
		{
			"name": "Al-Falaq",
			"index": 326
		},
		{
			"name": "An-Naas",
			"index": 327
		},
		{
			"name": "Supplication for Beneficial Knowledge, Good Provision, and Accepted Deeds",
			"index": 328
		},
		{
			"name": "Ayat al-Kursi",
			"index": 329
		},
		{
			"name": "Al-Ikhlas",
			"index": 330
		},
		{
			"name": "Al-Falaq",
			"index": 331
		},
		{
			"name": "An-Naas",
			"index": 332
		},
		{
			"name": "Entering the Evening in the Kingdom of Allah and Seeking His Protection",
			"index": 333
		},
		{
			"name": "Entering the Evening by Seeking Allah's Mercy",
			"index": 334
		},
		{
			"name": "The Master of Seeking Forgiveness",
			"index": 335
		},
		{
			"name": "Prayer for Health and Protection",
			"index": 336
		},
		{
			"name": "Prayer for Safety in This World and the Hereafter",
			"index": 337
		},
		{
			"name": "Prayer for Seeking Protection from the Whispers of Satan",
			"index": 338
		},
		{
			"name": "Remembrance to Be Protected from All Dangers",
			"index": 339
		},
		{
			"name": "Declaration of Contentment with Allah, Islam, and the Prophet Muhammad (Peace Be Upon Him)",
			"index": 340
		},
		{
			"name": " Asking for Guidance from Allah",
			"index": 341
		},
		{
			"name": "Entering the Evening on the Natural Disposition of Islam",
			"index": 342
		},
		{
			"name": "Remembrance of the Oneness of Allah",
			"index": 343
		},
		{
			"name": "Reciting Praise to Allah",
			"index": 344
		},
		{
			"name": "Daily Praise (Tasbih and Alhamdulillah)",
			"index": 345
		},
		{
			"name": "Seeking Forgiveness 100 Times a Day",
			"index": 346
		},
		{
			"name": "Prayer for Protection from the Evil of Allah's Creation",
			"index": 347
		},
		{
			"name": "Ayatul Kursi",
			"index": 348
		},
		{
			"name": "Al-Ikhlas",
			"index": 349
		},
		{
			"name": "Al-Falaq",
			"index": 350
		},
		{
			"name": "An-Naas",
			"index": 351
		},
		{
			"name": "Upon Entering The Morning by Asking for Protection from Allah",
			"index": 352
		},
		{
			"name": "Upon Entering The Morning with The Grace of Allah",
			"index": 353
		},
		{
			"name": "Sayyid al-Istighfar",
			"index": 354
		},
		{
			"name": "Dua for Protection and Good Health",
			"index": 355
		},
		{
			"name": "Dua for Salvation in The World and Hereafter",
			"index": 356
		},
		{
			"name": "Dua for Protection from Shaytan Whispers",
			"index": 357
		},
		{
			"name": "Asking for Protection from All Harms",
			"index": 358
		},
		{
			"name": "Declaration of Pleasure with Allah, Islam, and the Prophet Muhammad shallallahu 'alaihi wa sallam",
			"index": 359
		},
		{
			"name": "Asking Allah for Guidance",
			"index": 360
		},
		{
			"name": "Entering The Morning Upon The Natural Religion of Islam",
			"index": 361
		},
		{
			"name": "Tawheed Dhikr",
			"index": 362
		},
		{
			"name": "Read Tasbih",
			"index": 363
		},
		{
			"name": "Dua for Useful Knowledge, Good Sustenance, and Accepted Deeds",
			"index": 364
		},
		{
			"name": "Daily Tasbih and Tahmid",
			"index": 365
		},
		{
			"name": "Istighfar 100x a Day",
			"index": 366
		},
		{
			"name": "Dua Seeking Good In This World And In The Hereafter",
			"index": 367
		},
		{
			"name": "Dua To Make Heart Firm Upon Deen #1",
			"index": 368
		},
		{
			"name": "Dua To Make Heart Firm Upon Deen #2",
			"index": 369
		},
		{
			"name": "Dua To Make Heart Firm Upon Deen #3",
			"index": 370
		},
		{
			"name": "Dua To Seek Refuge Against The Loss Of Pleasure",
			"index": 371
		},
		{
			"name": "Dua To Resist Affliction",
			"index": 372
		},
		{
			"name": "Dua To Be Released From Debt, Anxiety, Weakness, Laziness, Fear, And Pressure from Others",
			"index": 373
		},
		{
			"name": "Dua When Getting Good News",
			"index": 374
		}
	]

	const filteredDuas = $state(duas.filter(dua =>
		dua.name.toLowerCase().includes(searchQuery.toLowerCase())
	));

</script>

<div class="min-h-screen bg-neutral-50 p-8">
	<div class="max-w-4xl mx-auto space-y-8">
		<h1 class="text-3xl font-bold text-center">Duas</h1>

		<div class="relative">
			<Search class="absolute left-2 top-2.5 h-4 w-4 text-neutral-500" />
			<Input
				type="text"
				placeholder="Search duas"
				class="pl-8"
				bind:value={searchQuery}
			/>
		</div>

		<ScrollArea class="h-[calc(100vh-12rem)]">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each filteredDuas as dua}
					<Card.Root class="cursor-pointer pb-2 hover:bg-neutral-100 transition-colors" onclick={() => goto(`/dua/${dua.index}`)}>
						<Card.Header>
							<Card.Title>{dua.name}</Card.Title>
							<Card.Description>Dua #{dua.index + 1}</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>
		</ScrollArea>
	</div>
</div>