### Experiences with KConfig {#experiences}

Here, we collect various quotes on KConfig by kernel practitioners and system software maintainers.

We collected these quotes by searching the web, inspecting the websites of system-software projects, and reading the Linux kernel mailing list (LKML) and associated Google Groups.

##### Linux Kernel Practitioners

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

##### Vegard Nossum (kconfig-sat)

> > Your SAT work is interesting, as it could help with the dependency
> > resolution of terse kconfig fragments. While I've not looked closely at
> > it yet, I'm just curious to hear what happened with it? Are you still
> > working on it? Were there any problematic roadblocks that got in your
> > way?
> <p class="quote-source"><a href="https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ" target="_blank" rel="noopener noreferrer">John Stultz (Source)</a></p>
>
> I guess there was no single roadblock. I mostly ran out of time during
> the GSoC and never really found the time to finish it afterwards. That
> said, I did have a lot of problems with finding the right
> encoding/formalisation of the kconfig language. It's simply not very
> well documented (the code is the only standard) and there are a lot of
> weird corner cases with hidden prompts, choice values, prompt
> dependencies, symbol dependencies, default values, conditional default
> values, you name it...
<p class="quote-source"><a href="https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ" target="_blank" rel="noopener noreferrer">Source</a></p>

##### Rob Landley (toybox)

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

<p class="quote-source"><a href="https://github.com/landley/toybox/blob/ea6c172dadd035a09b5157edf83f4f6e5d2f19b0/kconfig/README#L1" target="_blank" rel="noopener noreferrer">Source</a></p>

This code never went away, KConfig in toybox is still out-of-tree.

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

<p class="quote-source"><a href="http://lkml.iu.edu/hypermail/linux/kernel/0707.1/1741.html" target="_blank" rel="noopener noreferrer">Source</a></p>

The above-mentioned code was never merged.

>> If you really want to share kconfig, it'd be better to break it off
>> into a separately packaged project. For the time being, the kernel
>> makefiles can look for it in path, then fall back to its own copy
>> which we can eventually drop.
><p class="quote-source"><a href="https://lkml.iu.edu/hypermail/linux/kernel/0707.1/2419.html" target="_blank" rel="noopener noreferrer">Matt Mackall (Source)</a></p>
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
<p class="quote-source"><a href="https://lkml.iu.edu/hypermail/linux/kernel/0707.1/2803.html" target="_blank" rel="noopener noreferrer">Source</a></p>

This is exactly what happened with various attempts at standalone KConfig implementations.

##### Peter Korsgaard (Buildroot)

> The nice thing about [KConfig and Make] is that both of those technologies are technologies that you'll encounter anyway when you do embedded Linux systems.
> So it's hard to get around not ever configuring the Linux kernel, so menuconfig is something you need to figure out to use anyway, and building any software without using make is also pretty difficult.
> And of course none of these technologies are specific to Buildroot, so you had them already.

<p class="quote-source"><a href="https://youtu.be/0G_yJ50RA3I?t=287" target="_blank" rel="noopener noreferrer">Source</a></p>

##### Alexander Kriegisch (Freetz-NG)

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

<p class="quote-source"><a href="https://buildroot.uclibc.narkive.com/h0ophEJy/kconfig-how-to-implement-hierarchical-un-select-trees" target="_blank" rel="noopener noreferrer">Source</a></p>

##### Other Project Maintainers

We were unable to find public statements on KConfig by Denys Vlasenko (BusyBox), Cameron Rich (axTLS), Erik Andersen (uClibc), Waldemar Brodkorb (uClibc-ng), Abdoulaye Walsimou Gaye (EmbToolkit), Alexander Warg, Adam Lackorzynski, Michael Hohmuth (Kernkonzept GmbH, L4Re), Oliver Metz, fda77/fda89/cuma (Freetz-NG).
