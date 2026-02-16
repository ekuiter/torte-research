### Experiences with KConfig {#experiences}

Here, we collect various quotes on KConfig by kernel practitioners and system software maintainers.
We collected these quotes by searching the web, inspecting the websites of system-software projects, and reading the Linux kernel mailing list (LKML, aka "[kernel lore](https://lore.kernel.org/)") and [associated](https://groups.google.com/g/linux.kernel/) [Google Groups](https://groups.google.com/g/kconfig-sat/).

As for the various discussions on how to integrate a SAT solver into KConfig, we document those chronologically under [history](#history).
We include some quotes on SAT solvers both here and in the history section.

#### Kernel Configuration in General

This is a shortened excerpt from our [TOSEM paper](https://raw.githubusercontent.com/SoftVarE-Group/Papers/main/2025/2025-TOSEM-Kuiter.pdf) on the configurability of Linux.
Most of these experiences also relate to KConfig to some degree.

> Kernel practitioners (such as developers, maintainers, or end users) are, to some degree, aware of variability-related issues in Linux.
> For instance, developers discuss the [difficulty of configuring Linux distributions for end users](https://lwn.net/Articles/507239/).
> They also mention the negative impact of [introducing too many features on code readability](https://lkml.org/lkml/2008/5/1/65).
> [Maintaining default configurations](https://lwn.net/Articles/391372/) and [deciding on default values](https://lkml.org/lkml/2020/7/10/1261) are further challenges.
> The relevance of [feature location](https://lkml.org/lkml/2012/1/6/354) is another issue often discussed.
> While many issues can be resolved with proper discussion, the kernel’s configuration language KConfig, its tools, and the complexity of the kernel itself are repeatedly criticized.
>
> [Developers comment](https://lkml.org/lkml/2008/4/30/327): "There are simply already far too many [features] and they make the kernel harder and harder to change." 
> [Another remark](https://lwn.net/Articles/733405/) is that "the config subsystem has grown so large that it’s gotten out of control."
> [Others](https://lwn.net/Articles/733405/) add that "the config system is a nightmare."
>
> LWN editor Jonathan Corbet [summarizes](https://lwn.net/Articles/733405/) the situation as follows: "The kernel’s configuration system can be challenging to deal with; Linus Torvalds recently [called it](https://lwn.net/Articles/733418/) 'one of the worst parts of the whole project.' But it is also a part that nobody is really working on; it receives a bit of maintenance, but there does not appear to be any significant effort out there to address its shortcomings. Two-hundred companies support work on each kernel development cycle, but none of them see the configuration system as one of the problems that they need to solve. Until that changes, we are likely to continue to see users struggling with it."

---

> The config phase of the kernel is one of the worst parts of the whole
> project, and adding these kinds of random and incomprehensible config
> options does *not* help.
<p class="quote-source"><a href="https://lwn.net/Articles/733418/" target="_blank" rel="noopener noreferrer">Linus Torvalds (2017)</a></p>

#### SAT Integration in KConfig

> > > I can understand that, but at the same time, I do think that the
> > > "defconfig" file concept as it is now is just broken. To the point of
> > > being unfixable. It's obviously just a copy of the final .config, and it's
> > > fundamentally not really readable (and especially not writable) by humans.
> > <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/fNQ4D9fhWAwJ" target="_blank" rel="noopener noreferrer">Linus Torvalds (2010)</a></p>
> > 
> > Check out the [SAT solver link](https://lkml.org/lkml/2010/5/17/164) I quoted in the prior email. That sounds
> > like a really interesting solution. The defconfigs would ultimately hold
> > just what's unique to a given board, then the solver would figure out
> > what to else to enable just from those unique properties.
> > 
> > So we would still have defconfigs, but they would not have loads of
> > duplication like they do now.
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/WCkHm40YGGYJ" target="_blank" rel="noopener noreferrer">Daniel Walker (2010)</a></p>
> 
> It's often tedious for other cases too ("I just want to enable a
> particular driver, what do I need to do so?"), and I do agree with Daniel
> that the SAT solver approach sounds interesting as a way to solve some of
> the complexities.
> 
> At the same time, "SAT solver" does scream "over-engineering failure" to
> me. We've had horribly bad experiences with over-engineering in that space
> before. Yes, I know about MiniSAT and that these things can be done
> without necessarily huge amounts of complex code, but these things tend to
> grow to huge monsters.
> 
> Who knows.
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/xWyg7W0odv4J" target="_blank" rel="noopener noreferrer">Linus Torvalds (2010)</a></p>
> 
> But anyway, I'm not actually all that excited about playing games with
> Kconfig files either. And I simply don't care. To me, a "git rm
> *defconfig" is perfectly acceptable.
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/DBZkkzkidjQJ" target="_blank" rel="noopener noreferrer">Linus Torvalds (2010)</a></p>

Linus goes on to [discuss](https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/xvWlAZ1gWwgJ) how one might (in feature modeling terms) complete partial configurations in KConfig without a SAT solver.
Some answers include:

> That doesn't seem un-reasonable. Although the solver to me seems more
> elegant and we're getting the solver for some other reasons it seems
> (unrelated to this defconfig issue).
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/u_PpgUFFKBUJ" target="_blank" rel="noopener noreferrer">Daniel Walker (2010)</a></p>

> Seems to me that the brokenness of select is the main technical issue
> stopping us getting rid of the defconfigs. If there was a way to tell
> the Kconfig machinery "I want CONFIG_USB on, you figure out what has
> to be enabled for that to make sense" then it would all work. But
> that's a hard problem (and may possibly have multiple solutions).
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/kfQBfPFRc34J" target="_blank" rel="noopener noreferrer">Paul Mackerras (2010)</a></p>

Linus answers:

> > How about instead of using full defconfigs, we use minimal ones and
> > let the rest be determined with defaults.
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/v7u1XtHbnIcJ" target="_blank" rel="noopener noreferrer">Felipe Contreras (2010)</a></p>
> 
> I wouldn't mind that either, but there needs to be some way to check that
> they _are_ minimal. Which is more complicated than even SAT, afaik. 
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/DfCtfOk4V-4/m/OIn_ufRahIwJ" target="_blank" rel="noopener noreferrer">Linus Torvalds (2010)</a></p>



##### Linux Kernel Developers

> > Your SAT work is interesting, as it could help with the dependency
> > resolution of terse kconfig fragments. While I've not looked closely at
> > it yet, I'm just curious to hear what happened with it? Are you still
> > working on it? Were there any problematic roadblocks that got in your
> > way?
> <p class="quote-source"><a href="https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ" target="_blank" rel="noopener noreferrer">John Stultz (2011)</a></p>
>
> I guess there was no single roadblock. I mostly ran out of time during
> the GSoC [Google Summer of Code] and never really found the time to finish it afterwards. That
> said, I did have a lot of problems with finding the right
> encoding/formalisation of the kconfig language. It's simply not very
> well documented (the code is the only standard) and there are a lot of
> weird corner cases with hidden prompts, choice values, prompt
> dependencies, symbol dependencies, default values, conditional default
> values, you name it...
<p class="quote-source"><a href="https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ" target="_blank" rel="noopener noreferrer">Vegard Nossum (2015)</a></p>

> It's rather complicated and messy: each symbol can have multiple
> prompts, each prompt places different restrictions on the symbol's
> value, prompts should not determine the symbol's value if the symbol
> is selected, each prompt can have one or more default values, default
> values should not be enforced/used if the symbol is selected, etc. 
<p class="quote-source"><a href="https://groups.google.com/g/kconfig-sat/c/utCcD2R6sKU/m/m6PpxaTqKgAJ" target="_blank" rel="noopener noreferrer">Vegard Nossum (2015)</a></p>

> > > Ideally, someone should teach Kconfig to handle recursive dependencies,
> > > but in the meantime using "depends" makes sense.
> > <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/NpvN8eow-78J" target="_blank" rel="noopener noreferrer">Josh Triplett (2015)</a></p>
> >
> > Doesn't sound like anyone is that enthusiastic about that. 
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/_bkCUReCo20J" target="_blank" rel="noopener noreferrer">Luis Chamberlain (2015)</a></p>
> 
> Long-term, I think ideally we should have *every* visible Kconfig option
> always pulled in by "depends on" rather than "select", with visibility
> and recursion handled by smarter tools. That said, meddle not in the
> internals of Kconfig, for it has many unshorn yaks (and yaccs). 
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/ZpNhvvcl4aoJ" target="_blank" rel="noopener noreferrer">Josh Triplett (2015)</a></p>

> > I mean that Kconfig should do recursive dependency resolution. If B
> > depends on A, and C depends on B, I should be able to turn on C
> > directly and have B and A enabled. 
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/Oo6DvPSALzwJ" target="_blank" rel="noopener noreferrer">Josh Triplett (2015)</a></p>
> 
> That's really hard in practise you have to make any symbol that selects
> something depend on the dependencies of the selected symbol. You can't
> do this without involving a SAT solver. [A guy](https://lkml.org/lkml/2010/5/17/164) promised to do this a
> couple of years ago, but the patches never materialised. However, they
> may [exist somewhere](https://github.com/vegard/linux/tree/v5.14%2Bkconfig-sat-rc1/scripts/kconfig/satconf.c) if someone wants to take a look at completing it. 
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/IN7w7M7yFxMJ" target="_blank" rel="noopener noreferrer">James Bottomley (2015)</a></p>

> > And how should kconfig handle, say:
> > - B depends on (A || D)
> > - C depends on B
> > 
> > Should (B && D) be enabled or (B && A)? 
> <p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/e4DcJfmyCRAJ" target="_blank" rel="noopener noreferrer">Paul Bolle  (2015)</a></p>
> That's exactly the kind of problem that makes this difficult to do, and
> has thus stopped anyone from working on it. A fully general solution
> requires a system that can also solve arbitrary logic problems, which is
> not necessarily a feature.
<p class="quote-source"><a href="https://groups.google.com/g/linux.kernel/c/RTSr0z64uD0/m/IITe1j2l98MJ" target="_blank" rel="noopener noreferrer">Josh Triplett (2015)</a></p>



> > > I am applying various patches to Kconfig these days.
> > > However, I fear regressions.  I have been thinking of unit-tests.
> > > There are various cryptic parts in Kconfig and corner cases where
> > > it is difficult to notice breakage.  If unit-tests cover those,
> > > I will be able to apply changes more confidently.
> > <p class="quote-source"><a href="https://lore.kernel.org/all/1517877294-4826-1-git-send-email-yamada.masahiro@socionext.com/" target="_blank" rel="noopener noreferrer">Masahiro Yamada (2018)</a></p>
> > 
> > Personally I think this is great stuff.  I too have never wanted to
> > touch Kconfig stuff due to the complexity, and having unit tests like
> > this is a great idea to help ensure that things do not break.
> <p class="quote-source"><a href="https://lore.kernel.org/all/20180206093803.GC31558@kroah.com/" target="_blank" rel="noopener noreferrer">Greg Kroah-Hartman (2018)</a></p>
> 
> Yeah, breaking Kconfig is a sure way to feel the wrath.
> 
> The only reason I feel somewhat confident modifying Kconfig is that
> the Kconfiglib test suite happens to work as a regression test for the
> C implementation as well. It compares the .config files produced by
> the two implementations for all defconfig files and for
> all{no,yes,def}config, for all ARCHes, meaning any changes to the
> output of the C tools get flagged as well (with a diff).
<p class="quote-source"><a href="https://lore.kernel.org/all/CAFkk2KSdg0+AdnncRuwUNeHHoXv7zsdrrZEsMgq0esvAU5U7Eg@mail.gmail.com/" target="_blank" rel="noopener noreferrer">Ulf Magnusson (2018)</a></p>

##### System Software Maintainers

> This is the start of generally genericizing the kconfig infrastructure so it
> builds more easily out of tree for other projects.
>
> Lots of projects are already using menuconfig to configure themselves. Off
> the top of my head, busybox, uClibc, buildroot, uClinux, my toybox project,
> and several other things in the embedded space are already using it, plus a
> few more like uboot are looking to start.
>
> Unfortunately, they have to grab a snapshot of the kernel version and apply
> various modifications to it to build outside of kbuild, and those
> modifications don't get passed back upstream. The version in the kernel is
> the master that everybody periodically resyncs from, but they do a lot of work
> each time they resync.
>
> I've collected some of the changes uClibc and busybox made, as well as some
> general cleanups I've done for the toybox version, and now I'm trying to feed
> them back upstream. This patch is primarily cosmetic, there are more to come.
<p class="quote-source"><a href="http://lkml.iu.edu/hypermail/linux/kernel/0707.1/1741.html" target="_blank" rel="noopener noreferrer">Rob Landley, toybox (2007)</a></p>

The above-mentioned code was never merged.

>> If you really want to share kconfig, it'd be better to break it off
>> into a separately packaged project. For the time being, the kernel
>> makefiles can look for it in path, then fall back to its own copy
>> which we can eventually drop.
><p class="quote-source"><a href="https://lkml.iu.edu/hypermail/linux/kernel/0707.1/2419.html" target="_blank" rel="noopener noreferrer">Matt Mackall (2007)</a></p>
>
> That is _so_ not my call.
> 
> Right now, the version in linux-kernel is the master. I'm not saying that
> should be the case, I'm just saying it is. That's why I'm pushing patches
> that way rather than recommending anyone else use the version I cleaned up in
> toybox (which is currently fairly standalone).
> 
> If somebody wants to break it out and maintain it as a separate project, fine
> with me, just tell me where I should look and where to send patches. But if
> the linux kernel doesn't actually start _using_ said external version, and
> instead maintains its own, the external version will go the way of libsysfs
> when udev went "a shared library means we include it in our source tree and
> build our own copy".
<p class="quote-source"><a href="https://lkml.iu.edu/hypermail/linux/kernel/0707.1/2803.html" target="_blank" rel="noopener noreferrer">Rob Landley, toybox (2007)</a></p>

This is exactly what happened with various attempts at standalone KConfig implementations.

In the toybox repository, he later explains "the craptacular nature of kconfig, and the plan to replace it":

> This is a snapshot of linux 2.6.12 kconfig as washed through busybox and
> further modified by Rob Landley.
>
> Note: The build infrastructure in this directory is still GPLv2. Cleaning
> that out is a TODO item, but it doesn't affect the resulting binary.
>
> Way back when I tried to push my local changes to kconfig upstream
> in [2005](https://lwn.net/Articles/161086/)
> and [2006](http://lkml.iu.edu/hypermail/linux/kernel/0607.0/1805.html)
> and [2007](http://lkml.iu.edu/hypermail/linux/kernel/0707.1/1741.html)
> each of which spawned long "I think you should go do this and this and this
> but I'm not going to lift a finger personally" threads from the kernel
> developers. Twice I came back a year later to see if there was any interest
> in what I _had_ done, and the third thread was the longest of the lot but
> no code was merged as a result.
>
> *shrug* That's the linux-kernel community for you. I had an easier time
> than the author of squashfs, who spent 5 years actively trying to get his code
> merged, finally quitting his job to spend an unpaid year working on upstreaming
> squashfs _after_ after every major Linux distro had been locally carrying it
> for years. No really, [here's](https://lwn.net/Articles/563578/) where he wrote about it himself.
>
> This code is _going away_. Rewriting it is low priority, but removing it is a
> checklist item for the 1.0 toybox release. This directory contains the only
> GPL code left in the tree, and none of its code winds up in the resulting
> binary. It's just an editor that reads our Config.in files to update the top
> level .config file; you can edit they by hand if you really want to.
<p class="quote-source"><a href="https://github.com/landley/toybox/commit/a89f05496c2b5f88f980a136fc9f9cc4c271584e" target="_blank" rel="noopener noreferrer">Rob Landley, toybox (2015)</a></p>

This code never went away, KConfig in toybox is still out-of-tree.

> I read the very concise, but nonetheless puzzling kconfig-language.txt
> to understand how to optimise the awfully mis-structured menuconfig of a
> project I am participating in. I experimented with an own set of minimal
> Config.in files, but still do not understand the ins and outs of this tool.
> 
> Does anybody know of a tutorial (incl. samples!) for kconfig? What I
> want to achieve is something like this: [...]
> 
> I think I got this one working now. What disturbed my efforts were
> double definitions of config variables in other Config.in includes at
> unexpected places. (Did I mention the whole thing was a mess?) Sorry for
> asking at all.
<p class="quote-source"><a href="https://buildroot.uclibc.narkive.com/h0ophEJy/kconfig-how-to-implement-hierarchical-un-select-trees" target="_blank" rel="noopener noreferrer">Alexander Kriegisch, Freetz-NG (2007)</a></p>

The following is the closest we could find to someone praising KConfig, although this refers more to its adoption advantages than the actual tooling or configuration process:

> The nice thing about [KConfig and Make] is that both of those technologies are technologies that you'll encounter anyway when you do embedded Linux systems.
> So it's hard to get around not ever configuring the Linux kernel, so menuconfig is something you need to figure out to use anyway, and building any software without using make is also pretty difficult.
> And of course none of these technologies are specific to Buildroot, so you had them already.
<p class="quote-source"><a href="https://youtu.be/0G_yJ50RA3I?t=287" target="_blank" rel="noopener noreferrer">Peter Korsgaard, Buildroot (2013)</a></p>

We were unable to find public statements on KConfig by Denys Vlasenko (BusyBox), Cameron Rich (axTLS), Erik Andersen (uClibc), Waldemar Brodkorb (uClibc-ng), Abdoulaye Walsimou Gaye (EmbToolkit), Alexander Warg, Adam Lackorzynski, Michael Hohmuth (Kernkonzept GmbH, L4Re), Oliver Metz, fda77/fda89/cuma (Freetz-NG).
