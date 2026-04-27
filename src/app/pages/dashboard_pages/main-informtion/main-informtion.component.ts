import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainInformtion } from '../../../core/interface/main-informtion';
import { ToastrService } from 'ngx-toastr';
import { ApiInformtionService } from '../../../core/api/api-informtion.service';
import { BgService } from '../../../core/api/bg.service';

@Component({
  selector: 'app-main-informtion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './main-informtion.component.html',
  styleUrl: './main-informtion.component.css'
})
export class MainInformtionComponent {
  constructor( private _bg:BgService,private toaster: ToastrService, private _informtionApi: ApiInformtionService) { }
  ngOnInit(): void {
    this.initFormControl()
    this.initFormGrop()
    this.getinformton()
  }
  bg!: string
  ngAfterViewInit(): void {
    this._bg.$theme.subscribe(res=> this.bg =res )
  }
  

  informtion !: FormGroup
  description !: FormArray
  resume !: FormArray
  achievements !: FormArray
  services !: FormArray
  jobTitle !: FormControl
  course_name !: FormControl
  resume_description !: FormControl
  course_place !: FormControl
  start_date !: FormControl
  end_date !: FormControl
  achievement_name !: FormControl
  achievement_icon !: FormControl
  count !: FormControl
  service_name !: FormControl
  service_icon !: FormControl
  service_description !: FormControl

  //!resume
  create_resume(course_name: string = '', resume_description: string = '', course_place: string = '', start_date: string = '', end_date: string = '') {
    return new FormGroup({
      course_name: new FormControl(course_name, [Validators.required]),
      resume_description: new FormControl(resume_description, [Validators.required]),
      course_place: new FormControl(course_place, [Validators.required]),
      start_date: new FormControl(start_date, [Validators.required]),
      end_date: new FormControl(end_date, [Validators.required]),
    })
  }
  push_resume() {
    this.resumeControls.push(this.create_resume())
  }
  get resumeControls() {
    return this.informtion.get('resume') as FormArray
  }
  //! achievement
  create_achievement(achievement_name: string = '', achievement_icon: string = '', count: number = 0) {
    return new FormGroup({
      achievement_name: new FormControl(achievement_name, [Validators.required]),
      achievement_icon: new FormControl(achievement_icon, [Validators.required]),
      count: new FormControl(count, [Validators.required]),
    })
  }
  push_achievement() {
    this.achievementsControls.push(this.create_achievement())
  }
  get achievementsControls() {
    return this.informtion.get('achievements') as FormArray
  }
  //! service
  create_service(service_name: string = '', service_icon: string = '', service_description: string = '') {
    return new FormGroup({
      service_name: new FormControl(service_name, [Validators.required]),
      service_icon: new FormControl(service_icon, [Validators.required]),
      service_description: new FormControl(service_description, [Validators.required]),
    })
  }
  push_service() {
    this.servicesControls.push(this.create_service())
  }
  get servicesControls() {
    return this.informtion.get('services') as FormArray
  }
  //! description
  create_description(value: string = '') {
    return new FormControl(value, [Validators.required])
  }
  push_description() {
    this.descriptionControls.push(this.create_description())
  }
  get descriptionControls() {
    return this.informtion.get('description') as FormArray
  }

  initFormControl() {
    this.jobTitle = new FormControl('', [Validators.required])
    this.resume = new FormArray([this.create_resume()])
    this.services = new FormArray([this.create_service()])
    this.achievements = new FormArray([this.create_achievement()])
    this.description = new FormArray([this.create_description()])
  }
  initFormGrop() {
    this.informtion = new FormGroup({
      jobTitle: this.jobTitle,
      resume: this.resume,
      services: this.services,
      achievements: this.achievements,
      description: this.description
    })
  }
  removeControl(index: number, control: FormArray) {
    if (control.length > 1) {
      control.removeAt(index)
      this.toaster.success('Successful operation ')
    } else {
      this.toaster.warning('Cannot be deleted')
    }
  }
  clearControls() {
    this.resumeControls.clear()
    this.description.clear()
    this.achievementsControls.clear()
    this.servicesControls.clear()
  }
  data !: MainInformtion[]
  enableEdit() {
    if (!this.data || !this.data.length) return;

    this.clearControls()
    console.log(this.data[0]);
    if (this.data[0].resume?.length) {
      this.data[0].resume.forEach(r => {
        this.resumeControls.push(this.create_resume(r.course_name, r.resume_description, r.course_place, r.start_date, r.end_date))
      })
    } else {
      this.resumeControls.push(this.create_resume())
    }
    if (this.data[0].achievements?.length) {
      this.data[0].achievements.forEach(a => {
        this.achievementsControls.push(this.create_achievement(a.achievement_name, a.achievement_icon, a.count))
      })
    } else {
      this.achievementsControls.push(this.create_achievement())
    }
    if (this.data[0].services?.length) {
      this.data[0].services.forEach(s => {
        this.servicesControls.push(this.create_service(s.service_name, s.service_icon, s.service_description))
      })
    } else {
      this.servicesControls.push(this.create_service())
    }
    if (this.data[0].description?.length) {
      this.data[0].description.forEach(d => {
        this.descriptionControls.push(this.create_description(d))
      })
    } else {
      this.descriptionControls.push(this.create_description())
    }
    this.jobTitle.setValue(this.data[0].jobTitle)
  }
  //!get
  getinformton() {
    this._informtionApi.getInformtion().subscribe(res => {
      this.data = res
      this.enableEdit()
    })
  }
  updateInformtion() {
    if (this.informtion.valid) {
      this._informtionApi.eidtInformtion(this.informtion.value).subscribe(res => {
        this.toaster.success('The data was successfully updated', 'success')
      })
    } else {
      this.informtion.markAllAsTouched()
      Object.keys(this.informtion.controls).forEach(c => this.informtion.controls[c].markAsDirty())
    }
  }
  showIcon: boolean = false
  activeIcon: string = ''
  activeControl: any
  icons = [

    // 👤 USERS
    'user', 'users', 'user-plus', 'user-minus', 'user-pen', 'user-tie', 'user-graduate',
    'user-shield', 'user-secret', 'user-gear', 'id-card', 'address-card', 'fingerprint',
    'user-check', 'user-xmark', 'user-clock', 'user-group', 'users-gear',
    'address-book',

    // 💻 CORE TECH
    'code', 'laptop', 'desktop', 'server', 'database', 'microchip', 'keyboard', 'mouse',
    'headset', 'terminal', 'bug', 'wifi', 'cloud', 'cloud-arrow-up', 'cloud-arrow-down',
    'network-wired', 'robot', 'satellite', 'satellite-dish', 'gear', 'gears', 'cogs',
    'ai', 'brain', 'atom', 'globe-stand',
    'network-wired',
    'router',
    'server-shield',
    'cloud-bolt',
    'cloud-lock',
    'api',
    'link',
    'unlink',
    'external-link', 'brain-ai',
    'robot-astromech',
    'cpu-chip',
    'neural-network',
    'data-flow',
    'algorithm',
    'chatbot',
    'lightning-ai', 'app',
    'app-store',
    'widgets',
    'layout',
    'columns',
    'rows',
    'sidebar',
    'menu',
    'bars',

    // 🔧 DEV TOOLS
    'code-branch', 'code-commit', 'code-compare', 'file-code', 'file-lines', 'file-zip',
    'flask', 'vial', 'hammer', 'wrench', 'screwdriver', 'toolbox',
    'git', 'github', 'gitlab', 'merge', 'branch', 'pull-request', 'code-pull-request',
    'settings',
    'gear',
    'gears',
    'sliders',
    'sliders-h',
    'sliders-simple',
    'toggle-on',
    'toggle-off',
    'filter',
    'filter-circle',
    'ellipsis',
    'ellipsis-vertical',
    'wand-magic', 'info',
    'circle-info',
    'success',
    'check-circle',
    'circle-check',
    'warning',
    'exclamation',
    'exclamation-triangle',
    'circle-exclamation',
    'error',
    'times-circle',
    'ban', 'notification',
    'bell-slash',
    'bell-ring',
    'history',
    'clock-rotate-left',
    'calendar',
    'calendar-days',
    'calendar-check',
    'calendar-xmark', 'code-simple',
    'code-merge',
    'code-pull-request-closed',
    'bug-slash',
    'terminal-window',
    'console',
    'script',
    'function',
    // 📊 ANALYTICS / DASHBOARD
    'chart-line', 'chart-pie', 'chart-bar', 'chart-area',
    'chart-simple', 'gauge-high', 'gauge-low',
    'wave-square', 'timeline', 'archive',
    'box-archive',
    'box',
    'boxes',
    'database-lock',
    'database-gear',
    'upload-cloud',
    'download-cloud',

    // 📁 BUSINESS CORE
    'briefcase', 'building', 'building-columns', 'handshake', 'money-bill', 'coins',
    'wallet', 'credit-card', 'cash-register',
    'file-invoice', 'file-contract', 'file-signature',
    'calculator', 'clipboard', 'note-sticky',
    'scale-balanced', 'gavel',

    // 📈 MARKETING
    'bullhorn', 'megaphone', 'tags', 'percent', 'store', 'shop', 'cart-shopping',
    'basket-shopping', 'gift', 'ranking-star',

    // 📚 EDUCATION
    'book', 'book-open', 'graduation-cap', 'school', 'chalkboard',
    'pen', 'pencil', 'marker', 'scroll', 'certificate', 'laptop-code',

    // 📞 COMMUNICATION
    'envelope', 'phone', 'phone-volume', 'comments', 'comment', 'comment-dots',
    'paper-plane', 'inbox', 'bell', 'at',

    // 🎯 UI ACTIONS
    'plus', 'minus', 'check', 'xmark', 'edit', 'pen-to-square', 'trash',
    'download', 'upload', 'share', 'copy', 'paste', 'cut', 'search',
    'eye', 'eye-slash', 'refresh', 'sync', 'power-off',
    'expand', 'compress',

    // 🌐 NAVIGATION
    'home', 'globe', 'location-dot', 'map', 'compass', 'route', 'map-location',
    'earth-americas', 'arrow-up-right-from-square',

    // ❤️ GENERAL
    'star', 'heart', 'fire', 'lightbulb', 'bolt', 'rocket', 'crown', 'gem',

    // 🛡️ SECURITY
    'lock', 'unlock', 'shield', 'shield-halved', 'shield-check', 'shield-exclamation',
    'key', 'user-lock', 'ban', 'lock-open', 'key-skeleton',

    // 🎨 MEDIA
    'image', 'video', 'camera', 'film', 'music', 'headphones', 'play',
    'pause', 'stop', 'forward', 'backward',

    // 📡 DEVOPS / CLOUD
    'cloud', 'server', 'database', 'diagram-project', 'boxes-stacked',
    'server-network', 'dns', 'cloud-arrow-up',

    // 🧠 AI / MODERN TECH
    'sparkles', 'wand-sparkles', 'cpu', 'memory', 'brain-circuit', 'database-cog',

    // 📁 FILE SYSTEM
    'file', 'file-alt', 'file-image', 'file-audio', 'file-video',
    'folder', 'folder-open', 'folder-plus', 'folder-minus',

    // 🎨 DESIGN
    'paintbrush', 'swatchbook', 'layer-group', 'crop', 'adjust',
    'magic-wand-sparkles', 'palette',
    'paint-roller',
    'vector-square',
    'pen-fancy',
    'pen-ruler',
    'bezier-curve',
    'texture',
    'grid',
    'grid-2',

    // 📱 MOBILE
    'mobile', 'tablet', 'laptop', 'mobile-screen', 'mobile-button', 'qr-code',

    // 😊 EMOTIONS
    'smile', 'frown', 'face-smile', 'face-frown', 'face-angry',
    'face-surprise', 'face-laugh', 'face-meh',

    // ⚽ SPORTS
    'football', 'basketball', 'baseball', 'tennis-ball', 'volleyball', 'futbol',
    'table-tennis-paddle-ball', 'golf-ball-tee', 'hockey-puck', 'shuttlecock',
    'trophy', 'medal', 'whistle', 'stopwatch', 'clock',
    'dumbbell', 'person-running', 'person-biking', 'person-swimming', 'stadium',

    // 🎯 GOALS
    'target', 'bullseye', 'crosshairs', 'flag', 'flag-checkered',
    'arrow-up', 'arrow-down', 'arrow-right', 'arrow-left',

    // 👋 GESTURES
    'hand', 'hand-pointer', 'hand-point-up', 'hand-point-down',
    'hand-point-left', 'hand-point-right', 'hand-back-fist',
    'hand-peace', 'hand-spock', 'hand-holding',
    'thumbs-up', 'thumbs-down',

    // 🔷 SHAPES
    'square', 'square-full', 'circle', 'triangle', 'diamond', 'hexagon',
    'octagon', 'pentagon', 'cube', 'sphere', 'cubes',
    'square-minus', 'square-plus', 'square-check', 'square-xmark',

    // 🔊 AUDIO
    'volume-high', 'volume-low', 'volume-off', 'volume-xmark',
    'headphones', 'headset', 'podcast', 'radio',
    'waveform', 'wave-square', 'soundcloud', 'microphone',

    // 🌍 GLOBAL
    'language', 'globe-pointer'
  ];

  openIconPicker(control: any) {
    this.showIcon = !this.showIcon
    this.activeControl = control
  }
  selectIcon(icon: string) {
    this.activeIcon = icon
    this.activeControl.setValue(icon)
    this.showIcon = false
    this.activeControl = null;
  }
  @HostListener('document:click', ['$event'])
  close(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.icon-wrapper')) {
      this.activeControl = null;
    }
  }
}
