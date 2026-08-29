const fs = require('fs');
let content = fs.readFileSync('src/app/(app)/claims/page.tsx', 'utf-8');

const regex = /<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-\[#131215\]\/10 pb-4">\s*<h2 className="font-serif text-2xl font-medium text-\[#131215\]">Auto-Joint Declaration<\/h2>[\s\S]*?Track this request\s*<\/button>\s*<\/div>\s*\)}/m;

const newBlock = `<div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#131215]/10 pb-4">
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

if (regex.test(content)) {
  content = content.replace(regex, newBlock);
  fs.writeFileSync('src/app/(app)/claims/page.tsx', content);
  console.log("Regex replace succeeded!");
} else {
  console.log("Regex did not match.");
}
