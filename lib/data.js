// lib/data.js
export const CATEGORY_MAP = {
  communication: "PLa6KjAsEawqevPR1LJVjSKaYYt91P0DSY,PL6YdkEI-d5pTo0quOj8Dx8QnsgdErEP4z,PLiObSxAItudI-ZDyVePCROiUXs7AsLrtz,PLOaeOd121eBE8jnR0ksNzw4d6jD4A_oTy,PLek-xHaBuGk8mQq2HjM4ayYkFPakVYAI4,PLiObSxAItudK0gOItau23bZR0Qm1Ya3sb,PLiObSxAItudLZkPCe5DpAr1k68iZLDvGA,PLiObSxAItudLl5_Wf8qW_zlw071C2QaVS,PLq-0mUo3GUDoX6cCCiXumeCyVhpvXYRkY,PLldeVwwPE5atnXo39TqnbHk8BtoQoyBd2,PLiObSxAItudIWSJ3q2UnxDGyRRpaJOwVz,PLDEYEqzAVnURjzElGA4h6Dib1X0VN9lBK,PLiObSxAItudJ16miPq7SnMoypQdGuscUj,PLpL_KwBKIAci6QP5Q8ethQLzG2gH2THGC,PL0uwIo59tRFswNiJ0XaPgrCjBGZPt323G" ,
  // 💬 Master clear expression, storytelling, voice tone, active listening & persuasive speaking.

  posture: "PL6YdkEI-d5pTFuE_NRaq1TZztS3n4Hicu,PLH85N50IXcETeDP9q-zVyEiGq0vrs6aEe,PLefV978fp07fpvP_Pn-bMoNevbKL7qpaW,PLiSboUuYTOxLqlXZaahwVFZgZ3DnX-Uys,PLYIB3CxhjXizxY-ngY9u5V3cjzheve3Uv,PLrkU7wsPQIPojmPkBs7VYC1CyTXFqxGqd,PLwxNMb28XmpeXVzTs3o0rNm7J5dK3g4vL,PLkFxskVWBz-m-CORd5PLLytmfx5Nep-NV,PLUa1mxBKMRYnIPxFsRuOX8dCB_IFi0dWm",
  // 🧍 Develop powerful body language, confident stance, eye contact and physical charisma.

  confidence: "PLOaeOd121eBH0plz0kseVkUm2op3m3_eKPLCNbem8fOiHpDj_trJTSkZo07DJwiaesS,PLmf9Mm1mDyhR8xwp3AgOUtmKFmJRWG5n5,PLkVTKW7Z-_4xYUgCVZlHg-aP2lnFIyfqe,PLQhGHNVzIxIipQGRFbneXJ17XxhBUphlI,PLy-p9tvzOsAPitZvJCPBHIzhvZvoRGksH",
  // 🧠 Build unshakeable inner confidence, overcome self-doubt, and radiate self-worth.

  charisma: "PLefV978fp07dSgTtttgZwaP7bSwb5qfJJ,PLcTZ8xyOL50FN1MuChlrg6P-HqAkHaNle,PLY-DsOjuYYz_UZi5if5cZRpoHQthYo9OX,PL4q_eMH_tvXyHYBuaSvu-jmH9rC3lcRpe,PLefV978fp07cN5CDtFlZGeD1ob_WsPCyO,PLefV978fp07c4QVhKOm73pgeUtyB5oKH4",
  // 🌟 Become naturally magnetic — warmth, likability, social energy & instant connection. (Charisma on Command breakdowns + training series, 8–20 min videos)

  "emotional-intelligence": "PLZ8OfWm2VFchq4kMr1sSJekORkKf0OrOQ,PLspdzb_3PzaHHSGX91RAL1UdKu5XupXpS,PLch7hT776qGAMcQ5wZ1dgFkwkrMXzA_O9,PLalliGsZw3qMox8Mhb18W5QTW_sxGuhg7,PLF2DBDF3A068D8907,PLvAIoO_fbbVi7ZBXroHe90adMoSiTiXt-,PLRtL7CNiv619mH01ar328SL6_CikvPOl-",
  // ❤️ Understand & manage emotions — yours and others — empathy, self-regulation & social awareness. (Goleman domains, Yale/TED-style EQ talks, 10–25 min)

  motivation: "PLFE3dX9R6oqOTkLGr8RLo8AWmc7Pt0u-j,PLPtr4i1eRkfUfMLIRPqdjwTm3c6nTeBDF,PLuvz5bMpNm_38FxRlLyHIwfD2UJQpKi0_,PLHBG3_iAZUoZa4KQ8JBcOdI0kG3siLHY0,PLUGoRy4e6cf02gscrb10vRRmYA7GwVO1T,PLyauyIoqArCO6xYdGmk20YENh5GBkPNvA",
  // 🔥 Cultivate growth mindset, daily drive, resilience and peak mental performance. (Dweck growth mindset series + motivation clips, 5–20 min)

  resilience: "PLtXwdTXIFQUHqWIkZ3nVsmcsBfEGAtnof,PLJES5D9ZIzey2XfSUn8_14wKVG6HifpSl,PLefV978fp07djMjgDdneTaa9_KCwmAast",
  // 🛡️ Bounce back from failure, handle stress, develop grit and emotional endurance. (Grit/mental toughness evidence-based, Steve Magness-style, 5–15 min practical vids)

  "self-discipline": "PLW3yd6NHmEVqXsWO6qv2AytfUtVeVf6f7,PLnzvURqvmAIc_VENjwv0edt8yQLtX2cQr,PLYMfibJnEFgdJJhWMpYC27M8-Gzn0wFyj,PLjx8PNV3JInABLHdFIGMzH45Bf_uyzwdA,PLzosyZjafaQ1F3ljfhN0kqAkxQGUCZgyG",
  // ⏳ Create unbreakable consistency, strong routines, willpower and long-term focus. (Atomic Habits breakdowns, James Clear-inspired, 8–25 min)

  leadership: "PLoROMvodv4rPE-kcGtKBgYtSMqEJKbESC,PLGMhDns3Jx2LgryDyFvBeyCYZQ79yYEpG,PLiObSxAItudLZtkuk9qIR0VB2bGoDIAH6,PLxbcsN1z1FN6p9u2aLYNJq__gHA67X1Bs,PLw9yq7Lx2YztQTKTD6BQHCM1fMghKqT9G,PLxjGQaV8rAh3m2DshvNR6THhk9R_5Bkka",
  // 👑 Inspire, guide, make decisions, build trust and lead without formal authority. (Simon Sinek influence/leadership talks, 15–30 min depth)
};

// lib/data.js (append to existing file)

export const ACADEMIC_PLAYLIST_MAP = {
  // Technology & Engineering
  'software-development': 'PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT,PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT-PLillGF-RfqbYE6Ik_EuXA2iZFcE082B3s,PL4cUxeGkcC9iyuClsf48SSgsJPBStHo7F,PL4cUxeGkcC9h-AKdBSCRpqjD3y6T7Xgrb,PLillGF-RfqbYJVXBgZ_nA7FTAAEpp_IAc,PL4cUxeGkcC9j2pbmcA93DR1A3m7VEgSxK,PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d',
  // Traversy Media crash courses (10-25 min), freeCodeCamp projects, Net Ninja series, Simplilearn 2026 updated dev courses (segmented)

  'cybersecurity': 'PLIhvC56v63IIJZRa3lzK6IeBQOH_VFjUQ,PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1P,PL9LkIGLoJ-MES4vg-Ev3N7m47TxSHOocX,PL1H1sBF1VAKVmjZZr162aUNCt2Uy5ozAG,PLIhvC56v63IJ9SYBtdDsNnORfTNFCXR8_,PLIhvC56v63IIyU0aBUed4qwP0nSCORAdB,PLIhvC56v63IJgB-5AbrBepLgqYqECBj6m,PLIhvC56v63II4HZ9S4DK9sXo3r--bEJJd,PLIhvC56v63ILFXdeoBwVOWreRBEoZ2C3o',
  // NetworkChuck Ethical Hacking/CEH Journey (10-25 min practical), CCNA/Security+ series, John Hammond CTF/malware (15-30 min), freeCodeCamp hands-on

  'robotics': 'PLU9tksFlQRip8g2nUdsffNvc95lv9RO7h,PLBrq1OKRHMwUbbujTlmt1YGRzL9O0LfNJ,PLvOlSehNtuHt5vV3A3o9z3z3z3z3z3z3z,PLcMIv1c3yA3B0r7g4n0j1w0fP0z6w3Z0-',
  // Kevin McAleer Arduino/RPi projects (10-20 min), Robotics Back-End ROS (15-30 min segments), freeCodeCamp-related robotics intros

'ai': 'PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi,PLQVvvaa0QuDfKTOs3Keq_kaG2P55YRn5v',
  // Andrej Karpathy Neural Nets: Zero to Hero (15-30 min deep dives), general AI lectures, freeCodeCamp ML/AI, 3Blue1Brown neural visuals (10-20 min)

  'electronics': 'PLAROrg3NQn7cyu01HpOv5BWo217XWBZu0,PLWv9VM947MKi8KxDEki9x0FkQv3WBb2Ev,PLWv9VM947MKiPVBef5qMVW60hU1iHletX,PL3C5D963B695411B6,PLlowKtXNTBypETld5oX1ZMI-LYoA2LWi8D,PLzqS33DOPhJkRn6e9_OTdQwRojO8qlusI',
  // GreatScott! builds/tutorials (10-20 min), Engineering Mindset explanations (15-25 min), additional project series

  // Mathematics & Logic
  'algebra': 'PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab,PLHXZ9OQGMqXfUl0tcqPNTJsb7R6BqSLo6,PL49CF3715CB9EF31D,PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo',
  // 3Blue1Brown Essence (10-20 min visuals), Khan/Strang algebra (15-30 min lectures)

  'statistics': 'PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9,PLblh5JKOoLUIzaEkCLIUxQFjPIlapw8nU,PL8dPuuaLjXtNM_Y-bUAhblSAdWRnmBUcr,PL5102DFDC6790F3D0,PL5901C68C96DFCAD1,PLblh5JKOoLUJJpBNfk8_YadPwDTO2SCbx',
  // StatQuest breakdowns (10-20 min), Khan stats (10-25 min segmented)

  'calculus': 'PLHXZ9OQGMqxfT9RMcReZ4WcoVILP4k6-m,PLHXZ9OQGMqxc4ySKTIW19TLrT91Ik9M4n,PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr,PL0-GT3co4r2y2YErbmuJw2L5tW4Ew2O5B,PLHXZ9OQGMqxc_CvEy7xBKRQr6I214QJcd',
  // Dr. Trefor Bazett Calc I/II/III (10-25 min focused lectures), Professor Leonard (segmented 15-30 min), 3Blue1Brown Essence (10-20 min), Multivariable series

  'discrete-math': 'PLHXZ9OQGMqXfmH9UDBDU4UidAw7lO9tPL,PLHXZ9OQGMqxersk8fUxiUMSIx0DBqsKZS,PLBlnK6fEyqRhqJPDXcvYlLfXPh37L89g3,PLZh9gzIvXQUtB1t57_Xyk3yp9MK2iIFXX,PLDDGPdw7e6Aj0amDsYInT_8p6xTSTGEi2,PLNr8B4XHL5kHuVKyyzj7QshcT9yzPc_8J',
  // Dr. Trefor Bazett Discrete (10-25 min), additional logic/sets series

  // Natural Sciences
 'physics': 'PLSQl0a2vh4HC-daPugvP8kL_zuE3u_3Zr,PLqwfRVlgGdFAt8M2ni0v3dVgtW7-GqBgT,PL908547EAA7E4AE74,PL5Tk152XlY6RW0Oj6epwQV08eQq02YF11,PLU0ETLdKNmc6pJmBs-Ui75DXfyoWP2tje',
  // Khan Physics (10-25 min), MinutePhysics + explanatory (mid-length concepts)

  'chemistry': 'PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr,PLSQl0a2vh4HBnhjPgsJU2y1UhMwcYmb5u,PL7305D1BC80498DA6,PL1A79AF620ABA411C',
  // Crash Course Chemistry (10-15 min episodes), additional series

  'biology': 'PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB,PL3EED4C1D684D3ADF',
  // Crash Course Biology (10-15 min focused)

  'environment': 'PL8dPuuaLjXtOikZljhKAe28AkupJXnS2u,PL8dPuuaLjXtNdTKZkV_GiIYXpV9w4WxbX,PLFbDkRtjZS-odFHtGmt-jqM0YDi-uHh74,PL8dPuuaLjXtPAJr1ysd5yGIyiSFuh0mIL,PLZc5e3iBG1Z6xaD890tG4pAu3EnuFfxvF,PL908547EAA7E4AE74',
  // Crash Course Ecology (10-15 min), related environmental

  // Business & Management
 'marketing': 'PLlw9qxNtFom0IBuCE9bU0BWQ-pl-eA9Z-,PLAxUz0wM51b9UvvgJXvJxle6eyHBZOPAL,PLJR61fXkAx13HymYam75l8XRyayA3ail4,PLbgS3wCy_ryJB1heqfpU6NkaSpZEjB3yS,PLA-3i2qyJx6RnBDLKi8_mN5XV5qcf0mBO,PLcR9GcGpVy7Z0Hl6xUiRTyyreoG7lYhIn',
  // HubSpot/freeCodeCamp marketing modules (10-25 min)

  'finance': 'PLSQl0a2vh4HD1g_teRDEUkwMIIFlB8MJv,PLSQl0a2vh4HAyJUEdhnxoEFKSoKaZpTNT,PLeHSZnNv1k_kapOkS3zjSdduqf5B52--W,PLl3-0Xe_motSy0Bj9d5uwXJBCEyExa_QU,PLUydYW4Yv8260CV0vEr3ZRWjgn0rb9eUE',
  // Khan Finance (10-25 min segmented)

 'entrepreneurship': 'PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1,PL8dPuuaLjXtNamNKW5qlS-nKgA0on7Qze,PL8dPuuaLjXtMBsfP-lP28IFvfkISqJofM,PLfA33-E9P7FA-A72QKBw3noWuQbaVXqSD,PL-_Fnx4RXDBmHNB-YECXc_vUFwxFjiYze,PL-Woi1-PlvaLUt228iwebBEMgGJY6BDGq',
  // Y Combinator talks (15-30 min)

  'project-management': 'PLRtL7CNiv619mH01ar328SL6_CikvPOl-,PLEiEAq2VkUULPx4heWRZFC-fxQ9zWDaEf,PLsz8d8r2a994aHmh4m5txXqH9uPMNbO2F,PL13IJTeX9RPUJwpTxjKnYO950MhwGjz01,PLlKpQrBME6xJ4Mxv00syl8iOSgL-GVLMG,PLxnzMoe6ERJAYJ0JYhjxCC578MU-9Rgo0',
  // PMI/freeCodeCamp prep (10-30 min lessons)

  // Humanities & Social Sciences
 'history': 'PLBDA2E52FB1EF80C9,PL8dPuuaLjXtNjasccl-WajpONGX3zoY4M,PLhyKYa0YJ_5Aq7g4bil7bnGi0A8gTsawu,PLSQl0a2vh4HB9UeibLURBlcdR4XzputM9,PLtyN34w6H7y6m9kC5XHzTeziYGZ41UQtF,PL8dPuuaLjXtMwmepBjTSG593eG7ObzO7s',
  // Crash Course World History (10-15 min)

  'psychology': 'PLBQLA9c2766oNXpbsCXzVLMpoQ2Ghxllu,PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6,PLSQl0a2vh4HAvTRMBQ4gha-2xTrEeYanf,PLbKSbFnKYVY1EXnqpndtXTWO8D5q48-OW,PLbKSbFnKYVY0dPRjfo6JjaHCuo2beTCDc,PLsB_U2lnWYXxYVQHr5y4lmKGBFr-IjM3s',
  // Crash Course Psychology (10-15 min), additional intro series

  'sociology': 'PL8dPuuaLjXtMJ-AfB_7J1538YKWkZAnGA,PLdonEKZrk3Dm3P1bRhzhPXD1VhNKnZwMV,PL1O_shUH1zgWgki2sRwUJt4p39klBGvE4,PLSQl0a2vh4HCj7GDuF-6QIdV0QXoTDpAz',
  // Crash Course Sociology (10-15 min)

  'philosophy': 'PLtKNX4SfKpzX_bhh4LOEWEGy3pkLmFDmk,PLMs_JcuNozJben0STswCsLHEtWYZ5oKr4,PL8dPuuaLjXtNgK6MZucdYldNkMybYIHKR,PLtKNX4SfKpzUURFV6ucpn2TGaZYqXyrai,PLtKNX4SfKpzV9pyWlP-LjpDc_Xvf6OpME,PLoXvatGByNIDXcjDERAz_F9-E6Q6VdiDb',
  // Wireless Philosophy (8-20 min), Crash Course Philosophy

  // Arts & Design
 'graphic-design': 'PLLuEl8fyPVgMAUyTO-xhngVPWyVJkWHhp,PL-c9Rq56P4KkKDj7t4vn1thaswZkrwJQg,PLLuEl8fyPVgOMB_YFPcSFCie7-E9KODDR,PLgGbWId6zgaUBj8LZLfsFRzPy5TAezgQZ,PL-c9Rq56P4KmK4sVH49C4rjYh5VH6uK4o,PL7JpMMpENaD3toErPuQMIOnuHrNffMzSE',
  // Will Paterson/DesignCourse tutorials (10-25 min)

  'ui-ux': 'PLXDU_eVOJTx7QHLShNqIXL1Cgbxj7HlN4,PL0vfts4VzfNixzdc0PrJ,PLEiEAq2VkUULzCiDV5VyF7zR6zoDIT_eH,PLdvOfoe7PXT0ouChAnR1nHlT8BJIo5hP_,PLttcEXjN1UcHu4tCUSNhhuQ4riGARGeap,PLqQH_1enUVVTsuli_zuUz8hj__ouAYgt6',
  // Flux/DesignCourse UI/UX (15-30 min)

  'architecture': 'PL8PC59XL9BbpOD_72ow1vP-gTlDuPOHXg,PL8evaQZnDGAdCKg7XzBVKhFa5kGL7Up5l,PLoXdnnpVzGC9aIHqs_ZKpuIstknupslr2,PLLsDnFTg3QAUyye0JJIk84sZvxRsbIWCN,PLgqlOx702SDplSzhJIRieWyWdekRO2yeY',
  // ArchDaily/lecture series (mid-length)

 'music': 'PLW9UYOmoXTQlQDFBZWeRBEa23W0IJfWgk,PLKmtzaF7HDz0NdK9A0lvpxrOxWHzmP82l,PLUyDmNalB0rjteAmf8ciJ1zL2GqnzryS_,PLIuyaIoM30LKLdKkbZjLsrsxLXvNm2M3n,PLKwpCgEsoQRKv-7ZoWIx2rEq8NwrIt_Xu,PLWv9VMxkqQ66zR8Z-0v0v0v0v0v0v0v0v',
  // Andrew Huang production (10-25 min)
};