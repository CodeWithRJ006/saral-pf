const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf-8');

// 1. Update UAN input block
const oldUanBlock = `<div className="flex flex-col gap-1">
                    <label className="text-[10px] font-medium text-[#131215]/60 uppercase tracking-widest">
                      Universal Account Number
                    </label>
                    <input
                      type="text"
                      value={uan}
                      onChange={(e) => setUan(e.target.value)}
                      className="w-full min-h-[44px] rounded-none border-b border-[#131215]/20 bg-transparent py-2 text-lg font-serif tabular-nums text-[#131215] placeholder-[#131215]/20 outline-none transition-colors focus:border-[#2c524b]"
                      placeholder="1009 8472 9100"
                    />
                    <p className="text-xs text-[#131215]/40 mt-1">
                      Your Universal Account Number is on your payslip or the EPFO member portal.
                    </p>
                  </div>`;

const newUanBlock = `<div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-medium text-[#131215]/60 uppercase tracking-widest">
                        Universal Account Number
                      </label>
                      <span className="text-[10px] font-medium tracking-widest text-[#131215]/40 tabular-nums">
                        {uan.length}/12
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={uan}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\\D/g, '').slice(0, 12);
                        setUan(val);
                      }}
                      className="w-full min-h-[44px] rounded-none border-b border-[#131215]/20 bg-transparent py-2 text-lg font-serif tabular-nums text-[#131215] placeholder-[#131215]/20 outline-none transition-colors focus:border-[#2c524b]"
                      placeholder="1009 8472 9100"
                    />
                    <p className="text-xs text-[#131215]/40 mt-1">
                      Your Universal Account Number is on your payslip or the EPFO member portal.
                    </p>
                  </div>`;

content = content.replace(oldUanBlock, newUanBlock);

// 2. Update Authenticate button
const oldButton = `<button
                    onClick={handleStartAuth}
                    className="w-full min-h-[44px] border border-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white bg-[#2c524b] uppercase transition-colors hover:bg-[#1e3b35] flex items-center justify-center gap-3"
                  >
                    <span>Authenticate</span>
                  </button>`;

const newButton = `<button
                    onClick={handleStartAuth}
                    disabled={uan.length !== 12}
                    className="w-full min-h-[44px] border border-[#2c524b] px-4 py-4 text-xs font-medium tracking-widest text-white bg-[#2c524b] uppercase transition-colors hover:bg-[#1e3b35] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <span>Authenticate</span>
                  </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/app/page.tsx', content);
console.log("Updated page.tsx with strict UAN validation.");
