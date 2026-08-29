const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/claims/page.tsx', 'utf-8');

// 1. TRACK THIS REQUEST dummy button fix
content = content.replace(
  /<button className="w-full min-h-\[44px\] border border-\[#131215\]\/10 bg-transparent px-4 py-2 text-\[10px\] font-medium tracking-widest text-\[#131215\] uppercase hover:bg-\[#131215\]\/5 transition-colors">(\s*)TRACK THIS REQUEST(\s*)<\/button>/,
  '<button onClick={() => setShowDetailsModal(true)} className="w-full min-h-[44px] border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase hover:bg-[#131215]/5 transition-colors">$1TRACK THIS REQUEST$2</button>'
);

// 2. Fix the two buttons in CLAIM HALTED state
content = content.replace(
  /<div className="flex flex-col sm:flex-row gap-3">[\s\S]*?Launch Auto-Fix[\s\S]*?<\/button>\s*<\/div>/,
  `<div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                  onClick={() => setShowJdModal(true)}
                                  className="min-h-[44px] border border-red-700 bg-red-700 px-4 py-2 text-[10px] font-medium tracking-widest text-white uppercase hover:bg-red-800 transition-colors"
                                >
                                  Launch Auto-Fix
                                </button>
                              </div>`
);

// 3. Make jdStatus success state apply to all error scenarios, not just MISMATCH
content = content.replace(
  /\{\(scenario === "MISMATCH" && jdStatus === "success"\) \? \(/g,
  '{(scenario !== "CLEAN" && jdStatus === "success") ? ('
);

// 4. Update the hardcoded Auto-Joint Declaration modal with dynamic variables
const oldModalBlock = `<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">
                <h2 className="font-serif text-2xl font-medium text-[#131215]">Auto-Joint Declaration</h2>
                <button 
                  onClick={() => setShowJdModal(false)} 
                  className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] -mr-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-red-700 mb-2">Detected Discrepancy</p>
                  <div className="grid grid-cols-2 gap-4 border border-[#131215]/10 p-4">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">Aadhaar (Verified)</p>
                      <p className="font-serif text-lg text-[#131215]">{profile.panName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">UAN Record</p>
                      <p className="font-serif text-lg text-red-700">{profile.name}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-2">Drafted Legal Request</p>
                  <div className="bg-white border border-[#131215]/10 p-6 text-xs leading-relaxed text-[#131215]">
                    <p className="mb-4 font-bold">To, The Regional PF Commissioner,</p>
                    <p className="mb-4">
                      Sub: Joint Declaration by the member and the employer for correction of Name.
                    </p>
                    <p className="mb-4">
                      I, <span className="font-bold">{profile.panName}</span>, having UAN <span className="font-bold">{profile.uan}</span>, request you to update my name in the EPFO records to match my Aadhaar.
                    </p>
                    <p>
                      The erroneous name <span className="line-through">"{profile.name}"</span> was updated during initial registration.
                    </p>
                  </div>
                </div>

                {jdStatus === "idle" && (
                  <button 
                    onClick={handleFix}
                    className="w-full min-h-[44px] border border-[#2c524b] bg-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#1e3b35] flex items-center justify-center gap-2"
                  >
                    Authenticate & Submit <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {jdStatus === "submitting" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]/40">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#2c524b]" />
                    <p className="text-[10px] tracking-widest uppercase">Applying e-Signatures...</p>
                  </div>
                )}

                {jdStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full shadow-[0_0_40px_rgba(44,82,75,0.2)]">
                      <svg className="h-8 w-8 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                        <motion.path 
                          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                          d="M20 6L9 17l-5-5" 
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium mb-2 text-center">Forwarded to TechCorp India Pvt Ltd for digital approval.</p>
                    <p className="text-xs text-[#131215]/60 mt-2 text-center mb-6">Employer approval usually takes 2-3 working days.</p>
                    <button 
                      onClick={() => setShowJdModal(false)}
                      className="min-h-[44px] w-full border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5"
                    >
                      Track this request
                    </button>
                  </div>
                )}`;

const newModalBlock = `<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">
                <h2 className="font-serif text-2xl font-medium text-[#131215]">{modalTitle}</h2>
                <button 
                  onClick={() => setShowJdModal(false)} 
                  className="flex h-11 w-11 items-center justify-center text-[#131215]/40 hover:text-[#131215] -mr-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-red-700 mb-2">{modalDiscLabel}</p>
                  <div className="grid grid-cols-2 gap-4 border border-[#131215]/10 p-4">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">{modalDiscLeftLabel}</p>
                      <p className="font-serif text-lg text-[#131215]">{modalDiscLeftText}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#131215]/40 mb-1">{modalDiscRightLabel}</p>
                      <p className="font-serif text-lg text-red-700">{modalDiscRightText}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 mb-2">Drafted Legal Request</p>
                  {modalDraftText}
                </div>

                {jdStatus === "idle" && (
                  <button 
                    onClick={handleFix}
                    className="w-full min-h-[44px] border border-[#2c524b] bg-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white uppercase transition-colors hover:bg-[#1e3b35] flex items-center justify-center gap-2"
                  >
                    {modalBtnText} <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {jdStatus === "submitting" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]/40">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#2c524b]" />
                    <p className="text-[10px] tracking-widest uppercase">Applying e-Signatures...</p>
                  </div>
                )}

                {jdStatus === "success" && (
                  <div className="flex flex-col items-center justify-center py-8 text-[#131215]">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#F7F5F0] border border-[#2c524b]/20 rounded-full shadow-[0_0_40px_rgba(44,82,75,0.2)]">
                      <svg className="h-8 w-8 text-[#2c524b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                        <motion.path 
                          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                          d="M20 6L9 17l-5-5" 
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium mb-2 text-center">{modalSuccessMsg}</p>
                    <p className="text-xs text-[#131215]/60 mt-2 text-center mb-6">{modalSuccessSub}</p>
                    <button 
                      onClick={() => {
                        setShowJdModal(false);
                        setShowDetailsModal(true);
                      }}
                      className="min-h-[44px] w-full border border-[#131215]/10 bg-transparent px-4 py-2 text-[10px] font-medium tracking-widest text-[#131215] uppercase transition-colors hover:bg-[#131215]/5"
                    >
                      Track this request
                    </button>
                  </div>
                )}`;

// I must compress the whitespace of oldModalBlock before replace, or just do a generic replace
// since whitespace might differ due to prettier or OS differences.
// Better: regex replace the whole segment between `<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">`
// and `Track this request\n                    </button>\n                  </div>\n                )}`
const startIndex = content.indexOf('<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">');
const endIndexStr = 'Track this request\n                    </button>\n                  </div>\n                )}';
const endIndex = content.indexOf(endIndexStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newModalBlock + content.substring(endIndex + endIndexStr.length);
  console.log("Successfully replaced modal JSX via exact indexOf");
} else {
  console.log("Could not find start or end index for modal block.");
}

// 5. Rupee symbol encoding fix
content = content.replace(/A\?sA13,50,000/g, '?13,50,000');
content = content.replace(/A\xef\xbf\xbd\?sA13,50,000/g, '?13,50,000');
// Also cover generic corrupted text right before "13,50,000" in that span
content = content.replace(/<p className="font-serif text-4xl text-\[#131215\]">.*?13,50,000/g, '<p className="font-serif text-4xl text-[#131215]">?13,50,000');


fs.writeFileSync('src/app/(app)/claims/page.tsx', content);
